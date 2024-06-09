import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS
import secrets
from collections import deque
from passlib.hash import pbkdf2_sha256
import os
import time
import zxcvbn
import re
from warrior import Warrior
import pandas as pd
from corewar_driver.corewar.game import game



cred = credentials.Certificate("corewars-48cd2-firebase-adminsdk-tyekb-3eddbce5b0.json")
databaseURL = 'https://corewars-48cd2-default-rtdb.europe-west1.firebasedatabase.app/'
storageBucket = 'gs://corewars-48cd2.appspot.com/games_files'
firebase_admin.initialize_app(cred,{
	'databaseURL': databaseURL,
    'storageBucket': storageBucket
	})

ref = db.reference("/")
bucket = storage.bucket()

app = Flask(__name__)
CORS(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.session_protection = "strong"


app.secret_key = "9D9639B4D842CBAB1C972D8EDA2D123E3242D9ABEF61F3EB55B4CC8AAD"

class User(UserMixin):
    def __init__(self, id, email, username, password, won, lost):
        self.id = id
        self.email = email
        self.username = username
        self.password = password
        self.won = won
        self.lost = lost

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)


@app.route('/check_password_strength', methods=['POST'])
def check_password_strength_route():
    try:
        password = request.json['password']
        strength, conditions = calculate_password_strength(password)
        return jsonify({'strength': strength, 'conditions' : conditions})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


def password_conditions(password):
    length_condition = len(password) >= 8
    uppercase_condition = bool(re.search(r'[A-Z]', password))
    lowercase_condition = bool(re.search(r'[a-z]', password))
    digit_condition = bool(re.search(r'\d', password))
    special_char_condition = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    password_strength = zxcvbn.zxcvbn(password)
    entropy_condition = length_condition and password_strength['score'] < 3

    return [length_condition, uppercase_condition, lowercase_condition, digit_condition, special_char_condition, entropy_condition]


def calculate_password_strength(password):
    conditions = password_conditions(password)
    return int(sum(conditions) / len(conditions) * 100), conditions


def generate_salt():
    return os.urandom(16)


def hash_password(password, salt, rounds=100000):
    return pbkdf2_sha256.using(salt=salt, rounds=rounds).hash(password)


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data["email"]
    username = data["username"]
    password = data["password"]
    confirm_password = data["confirm_password"]
    if password == confirm_password:
        if len(password) < 8:
            return jsonify({"error": 'Password must contain at least 8 characters'}), 400
        
        if not any(char.isdigit() for char in password):
            return jsonify({"error": 'Password must contain at least one digit'}), 400
        
        if not any(char.isupper() for char in password): 
            return jsonify({"error": 'Password must contain at least one uppercase letter'}), 400
        
        if not any(char.islower() for char in password):
            return jsonify({"error": 'Password must contain at least one lowercase letter'}), 400
        
        if not any(char in '!@#$%^&*()-_=+[]{}|;:\'",.<>/?' for char in password):
            return jsonify({"error": 'Password must contain at least one special character'}), 400
        
        password_strength = zxcvbn.zxcvbn(password)
        if password_strength['score'] > 3:
            return jsonify({"error": 'Password is too easy to hack'}), 400

        users_ref = ref.child('users')
        query = users_ref.order_by_child('email').equal_to(email).limit_to_first(1)
        results = query.get()

        if results:
            return jsonify({"error": 'The email was already registered'}), 400
        
        query = users_ref.order_by_child('username').equal_to(username).limit_to_first(1)
        results = query.get()

        if results:
            return jsonify({"error": 'The username was already taken'}), 400

        salt = generate_salt()
        hashed_password = hash_password(password, salt)
        user_data = {
            "email": email,
            "password": hashed_password,
            "username": username,
            "won": 0,
            "lost": 0
        }
        new_user_ref = ref.child('users').push(user_data)
        new_user_id = new_user_ref.key
        return jsonify({"message": "Registration successful", "user_id":new_user_id}), 200
    else:
        return jsonify({"error": 'Passwords do not match'}), 400


def random():
    random_value = secrets.randbelow(1000) / 1000
    return random_value


@login_manager.user_loader
def user_loader(user_id):
    if not user_id:
        return None
    users_ref = ref.child('users')
    result = users_ref.child(user_id).get()
    if not result:
        return None
    
    user_data = result
    user_username = user_data.get('username')
    user_email = user_data.get('email')
    user_password = user_data.get('password')
    user_won = user_data.get('won')
    user_lost = user_data.get('lost')
    user = User(user_id, user_email, user_username, user_password, user_won, user_lost)
    return user


def verify_password(provided_password, stored_password):
    return pbkdf2_sha256.verify(provided_password, stored_password)

recent_users = deque(maxlen=3)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    login = data.get("login")
    password = data.get("password")
    users_ref = ref.child('users')
    query = users_ref.order_by_child('username').equal_to(login).get()
    result = list(query.values())

    if not result:
        return jsonify({"error": "Incorrect login details"}), 400

    user_id = list(query.keys())[0]
    user = user_loader(user_id)

    if user is None:
        time.sleep(random())
        return jsonify({"error": "Incorrect login details"}), 400

    if verify_password(password, user.password):
        login_user(user)
        return jsonify({"message": "Login successful", "user_id": user_id}), 200

    time.sleep(random())
    return jsonify({"error": "Incorrect login details"}), 400


@app.route("/logout")
def logout():
    logout_user()
    return redirect("/")


@app.route("/hello", methods=['GET'])
@login_required
def hello():
    if request.method == 'GET':
        username = current_user.username

        return render_template("hello.html", username=username)

# ----------- WARRIORS ------------
@login_required
def addNewWarrior(name,code):
    warrior = Warrior(name)
    warrior_data = {
        "user_id": current_user.id,
		"name": name,
		"won": 0,
		"lost": 0,
        "busy": False
	}
    new_warrior = ref.child('warriors').push(warrior_data)
    warrior_id = new_warrior.key
    destination = "/warriors/"
    filename = warrior_id
    destination = destination + filename + '.txt'

    local_file_path = filename + ".txt"
    with open(local_file_path, 'w') as file:
        file.write(code)

    blob = bucket.blob(destination)
    blob.upload_from_filename(local_file_path)

    return warrior


@login_required
def deleteWarrior(warrior_id):
    filepath = "/warriors/" + warrior_id + ".txt"
    blob = bucket.blob(filepath)
    blob.delete()
    user_ref = ref.child('warriors').child(warrior_id)
    user_ref.delete()


@login_required
def getWarriorsList():
    warriors_ref = ref.child('warriors')
    query = warriors_ref.order_by_child('user_id').equal_to(current_user.id).get()
    results = list(query.values())
    warriors_list = []

    if results:
        warriors_id = list(query.keys())
        i = 0

        for warrior_id in warriors_id:
            warrior_data = results[i]
            name = warrior_data.get('name')
            won = warrior_data.get('won')
            lost = warrior_data.get('lost')
            busy = warrior_data.get('busy')
            data = [warrior_id, name, won, lost, busy]
            warriors_list.append(data)
            i += 1

    df = pd.DataFrame(warriors_list,
                  columns=['warrior_id', 'name', 'won', 'lost','busy'])
    
    return df
 

@login_required
def saveWarrior(warrior):
    warrior.saveToDB(ref)


@login_required
def getWarrior(warrior_id):
    warrior_ref = ref.child('warriors')
    warrior_data = warrior_ref.child(warrior_id)
    warrior = Warrior(warrior_data.get('user_id'),warrior_data.get('name'),warrior_data.get('code'),
                      warrior_data.get('won'),warrior_data.get('lost'),warrior_data.get('busy'))
    return warrior

# ----------- GAMES ------------
@login_required
def saveGame(warrior_1_id,warrior_2_id):
    warrior_ref = ref.child('warriors')
    warrior_1_code = warrior_ref.child(warrior_1_id).get('code')
    warrior_2_code = warrior_ref.child(warrior_2_id).get('code')
    cycles, round_winner_id, wins, core_states, exceptions = game(warrior_1_id, warrior_1_code, warrior_2_id, warrior_2_code)
    if wins[warrior_1_id] > wins[warrior_2_id]:
        #warrior_1 and it's user update
        warrior_1_wins = warrior_ref.child(warrior_1_id).get('won')
        warrior_ref.child(warrior_1_id).update({'won': warrior_1_wins + 1})
        warrior_1_user_id = warrior_ref.child(warrior_1_id).get('user_id')
        user_ref = ref.child('users').child(warrior_1_user_id)
        user_won = user_ref.child('won').get()
        user_ref.update({'won': user_won + 1})
        
        #warrior_2 and it's user update
        warrior_2_lost = warrior_ref.child(warrior_2_id).get('lost')
        warrior_ref.child(warrior_2_id).update({'lost': warrior_2_lost + 1})
        warrior_2_user_id = warrior_ref.child(warrior_2_id).get('user_id')
        user_ref = ref.child('users').child(warrior_2_user_id)
        user_lost = user_ref.child('lost').get()
        user_ref.update({'lost': user_lost + 1})
    elif wins[warrior_1_id] < wins[warrior_2_id]:
        warrior_2_wins = warrior_ref.child(warrior_2_id).get('won')
        warrior_ref.child(warrior_2_id).update({'won': warrior_2_wins + 1})
        warrior_2_user_id = warrior_ref.child(warrior_2_id).get('user_id')
        user_ref = ref.child('users').child(warrior_2_user_id)
        user_won = user_ref.child('won').get()
        user_ref.update({'won': user_won + 1})

        warrior_1_lost = warrior_ref.child(warrior_1_id).get('lost')
        warrior_ref.child(warrior_1_id).update({'lost': warrior_1_lost + 1})
        warrior_1_user_id = warrior_ref.child(warrior_1_id).get('user_id')
        user_ref = ref.child('users').child(warrior_1_user_id)
        user_lost = user_ref.child('lost').get()
        user_ref.update({'lost': user_lost + 1})
    game_data = {
            "warrior_1_id": warrior_1_id,
            "warrior_2_id": warrior_2_id,
            "warrior_1_wins": wins[warrior_1_id],
            "warrior_2_wins": wins[warrior_2_id],
        }
    new_game_ref = ref.child('games').push(game_data)
    new_game_id = new_game_ref.key
    for r in range(10):
        round_data = {
            "round_number": r,
            "game_id": new_game_id,
            "cycles": cycles[r],
            "winner": round_winner_id[r],
            "error": exceptions[r]
        }
        new_game_ref = ref.child('rounds').push(round_data)
    filepath = "/games/" + new_game_id + ".txt"
    blob = bucket.blob(filepath)
    blob.upload_from_string(core_states)

@login_required
def saveRound(round_number,game_id,cycles,warr_1_lives,warr_1_wins,warr_2_lives,warr_2_wins):
    round_data = {
		"round_number": round_number,
		"game_id": game_id,
		"cycles": cycles,
		"warr_1_lives": warr_1_lives,
		"warr_1_wins": warr_1_wins,
		"warr_2_lives": warr_2_lives,
		"warr_2_wins": warr_2_wins
	}
    ref.child('rounds').push(round_data)


if __name__ == "__main__":
    app.run(debug=True)
