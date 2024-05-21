import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import secrets
from collections import deque
from passlib.hash import pbkdf2_sha256
import os
import time
import zxcvbn
import re
from warrior import Warrior
import pandas as pd



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

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.secret_key = "9D9639B4D842CBAB1C972D8EDA2D123E3242D9ABEF61F3EB55B4CC8AAD"

class User(UserMixin):
    def __init__(self, id, email, username, password, won, lost):
        self.id = id
        self.email = email
        self.username = username
        self.password = password
        self.won = won
        self.lost = lost


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


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    elif request.method == 'POST':
        email = request.form["email"]
        username = request.form["username"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]
        if password == confirm_password:
            if len(password) < 8:
                error = 'Password must contain at least 8 characters'
                return render_template("register.html", error=error)
            
            if not any(char.isdigit() for char in password):
                error = 'Password must contain at least one digit'
                return render_template("register.html", error=error)
            
            if not any(char.isupper() for char in password): 
                error = 'Password must contain at least one uppercase letter'
                return render_template("register.html", error=error)
            
            if not any(char.islower() for char in password):
                error = 'Password must contain at least one lowercase letter'
                return render_template("register.html", error=error)
            
            if not any(char in '!@#$%^&*()-_=+[]{}|;:\'",.<>/?' for char in password):
                error = 'Password must contain at least one special character'
                return render_template("register.html", error=error)
            
            password_strength = zxcvbn.zxcvbn(password)
            if password_strength['score'] > 3:
                error = 'Password does not meet entropy requirements'
                return render_template("register.html", error=error)

            users_ref = ref.child('users')
            query = users_ref.order_by_child('email').equal_to(email).limit_to_first(1)
            results = query.get()

            if results:
                error = 'The email was already registered'
                return render_template("register.html", error=error)
            
            query = users_ref.order_by_child('username').equal_to(username).limit_to_first(1)
            results = query.get()

            if results:
                error = 'The username was already taken'
                return render_template("register.html", error=error)

            salt = generate_salt()
            hashed_password = hash_password(password, salt)
            user_data = {
				"email": email,
				"password": hashed_password,
				"username": username,
				"won": 0,
				"lost": 0
			}
            ref.child('users').push(user_data)
            return redirect("/")
        else:
            error = 'Passwords do not match'
            return render_template("register.html", error=error)


def random():
    random_value = secrets.randbelow(1000) / 1000
    return random_value


@login_manager.user_loader
def user_loader(login):
    if not login:
        return None
    users_ref = ref.child('users')
    query = users_ref.order_by_child('email').equal_to(login).get()
    results = list(query.values())

    if not results:
        query = users_ref.order_by_child('username').equal_to(login).get()
        results = list(query.values())
        if not results:
            return None
            
    user_data = results[0]
    user_id = list(query.keys())[0]
    user_username = user_data.get('username')
    user_email = user_data.get('email')
    user_password = user_data.get('password')
    user_won = user_data.get('won')
    user_lost = user_data.get('lost')
    user = User(user_id, user_email, user_username, user_password, user_won, user_lost)
    return user


@login_manager.request_loader
def request_loader(request):
    login = request.form.get('login')
    if login:
        users_ref = ref.child('users')
        query = users_ref.order_by_child('email').equal_to(login).get()
        results = list(query.values())

        if not results:
            query = users_ref.order_by_child('username').equal_to(login).get()
            results = list(query.values())
            if not results:
                return None
                
        user_data = results[0]
        user_id = list(query.keys())[0]
        user_username = user_data.get('username')
        user_email = user_data.get('email')
        user_password = user_data.get('password')
        user_won = user_data.get('won')
        user_lost = user_data.get('lost')
        user = User(user_id, user_email, user_username, user_password, user_won, user_lost)
        return user
    return None


def verify_password(provided_password, stored_password):
    return pbkdf2_sha256.verify(provided_password, stored_password)


recent_users = deque(maxlen=3)


@app.route("/", methods=["GET","POST"])
def login():
    if request.method == "GET":
        return render_template("index.html")
    if request.method == "POST":
        login = request.form.get("login")
        password = request.form.get("password")

        user = user_loader(login)

        if user is None:
            error = "Incorrect login details"
            time.sleep(random())
            return render_template("index.html", error=error)

        if verify_password(password, user.password):
            print("tak")
            login_user(user)
            return redirect(url_for('hello'))

        error = "Incorrect login details"
        time.sleep(random())
        return render_template("index.html", error=error)


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
    destination = "/worriors/"
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
    filepath = "/worriors/" + warrior_id + ".txt"
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
def saveWorrior(warrior):
    warrior.saveToDB(ref)


@login_required
def getWarrior(warrior_id):
    warrior_ref = ref.child('warriors')
    warrior_data = warrior_ref.child(warrior_id)
    warrior = Warrior(warrior_data.get('user_id'),warrior_data.get('name'),warrior_data.get('code'),
                      warrior_data.get('won'),warrior_data.get('lost'),warrior_data.get('busy'))
    return warrior


@login_required
def saveGame(warrior_1_id,warrior_2_id,rounds):
    worrior_data = {
        "warrior_1_id": warrior_1_id,
		"warrior_2_id": warrior_2_id
	}
    new_game = ref.child('worriors').push(worrior_data)
    game_id = new_game.key
    for round in rounds:
        saveRound(round["number"],game_id,round["cycles"],round["w1l"],round["w1w"],round["w2l"],round["w2w"])
    # TODO zapisywanie gry do pliku, co ma być w pliku?


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