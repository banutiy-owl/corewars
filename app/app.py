import firebase_admin
from firebase_admin import credentials, db, storage
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
from app.warrior import Warrior
from corewar_driver.corewar.game import game
from corewar_driver.corewar.redcode import parse
import os

file_path = os.path.abspath('app\corewars-48cd2-firebase-adminsdk-tyekb-3eddbce5b0.json')
cred = credentials.Certificate(file_path)
databaseURL = 'https://corewars-48cd2-default-rtdb.europe-west1.firebasedatabase.app/'
storageBucket = 'corewars-48cd2.appspot.com'
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

@app.route("/user_info", methods=['GET'])
def get_user_info():
    user_id = request.args.get('id')
    users_ref = ref.child('users')
    result = users_ref.child(user_id).get()
    return jsonify({"won":result.get('won'), "lost": result.get('lost')}), 201

@app.route("/hello", methods=['GET'])
@login_required
def hello():
    if request.method == 'GET':
        username = current_user.username

        return render_template("hello.html", username=username)


# ----------- WARRIORS ------------
@app.route('/warriors', methods=['POST'])
def save_warrior():
    request_data = request.json
    text = request_data['code']
    user_id = request_data['user_id']
    try:
        DEFAULT_ENV = {'CORESIZE': 8000}
        warrior = parse(text.split('\n'), DEFAULT_ENV)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    warrior = saveNewWarrior(warrior.name,text, user_id)
    return jsonify({"message": "Added warrior successfully", "name": warrior.name}), 200

def saveNewWarrior(name,code, user_id):
    warrior_data = {
        "user_id": user_id,
		"name": name,
        "code": code,
		"won": 0,
		"lost": 0,
        "busy": False,
        "current": True
	}
    new_warrior = ref.child('warriors').push(warrior_data)
    warrior_id = new_warrior.key
    warrior = Warrior(warrior_id,user_id,name,code)

    return warrior

@app.route("/warrior/<warrior_id>", methods=['PUT'])
def saveEditWarrior(warrior_id):
    request_data = request.json
    text = request_data['code']
    user_id = request_data['user_id']

    warrior_ref = ref.child('warriors').child(warrior_id)
    warrior_data = warrior_ref.get()
    if warrior_data.get('busy') == True:
        return jsonify({"error": "Warrior is busy"}), 400
    
    games_ref = ref.child('games')
    games_with_warrior_1 = games_ref.order_by_child('warrior_1_id').equal_to(warrior_id).get()
    games_with_warrior_2 = games_ref.order_by_child('warrior_2_id').equal_to(warrior_id).get()

    try:
        DEFAULT_ENV = {'CORESIZE': 8000}
        warrior = parse(text.split('\n'), DEFAULT_ENV)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    if games_with_warrior_1 or games_with_warrior_2:
        warrior = saveNewWarrior(warrior.name,text, user_id)
        warrior_ref.update({'current': False})
        return jsonify({"message": "Edited warrior successfully", "name": warrior.name}), 200
    else:
        warrior_ref.update({'name': warrior.name, 'code': text})
        return jsonify({"message": "Edited warrior successfully", "name": warrior.name}), 200


@app.route("/warrior/<warrior_id>", methods=['DELETE'])
def deleteWarrior(warrior_id):
    warrior_ref = ref.child('warriors').child(warrior_id)
    warrior_data = warrior_ref.get()
    if warrior_data.get('busy') == True:
        return jsonify({"error": "Warrior is busy"}), 400
    
    games_ref = ref.child('games')
    games_with_warrior_1 = games_ref.order_by_child('warrior_1_id').equal_to(warrior_id).get()
    games_with_warrior_2 = games_ref.order_by_child('warrior_2_id').equal_to(warrior_id).get()

    if games_with_warrior_1 or games_with_warrior_2:
        warrior_ref.update({'current': False})
        return jsonify({"message": "Warrior deleted successfully"}), 200
    else: 
        warrior_ref.delete()
        return jsonify({"message": "Warrior deleted successfully"}), 200

@app.route("/get_warriors", methods=['GET'])
def getWarriorsList():
    user_id = request.args.get('user_id')
    warriors_ref = ref.child('warriors')
    query = warriors_ref.order_by_child('user_id').equal_to(user_id).get()
    results = list(query.values())
    warriors_list = []

    if results:
        warriors_id = list(query.keys())
        i = 0

        for warrior_id in warriors_id:
            warrior_data = results[i]
            if warrior_data.get('current') == True:
                name = warrior_data.get('name')
                won = warrior_data.get('won')
                lost = warrior_data.get('lost')
                busy = warrior_data.get('busy')
                code = warrior_data.get('code')
                data = {
                    "id":warrior_id, 
                    "name": name, 
                    "won": won, 
                    "lost":lost,
                    "busy": busy,
                    "code" : code
                }
                warriors_list.append(data)
            i += 1
    warriors_list.reverse()
    return jsonify(warriors_list), 200


def getWarrior(warrior_id):
    warrior_ref = ref.child('warriors')
    warrior_data = warrior_ref.child(warrior_id).get()
    warrior = Warrior(warrior_data.get('user_id'),warrior_id,warrior_data.get('name'),warrior_data.get('code'),
                      warrior_data.get('won'),warrior_data.get('lost'),warrior_data.get('busy'))
    return warrior

# ----------- GAMES ------------
@app.route("/get_games", methods=['GET'])
def getGamesList():
    user_id = request.args.get('user_id')

    warriors_ref = ref.child('warriors')
    query = warriors_ref.order_by_child('user_id').equal_to(user_id).get()
    warriors_ids = list(query.keys())

    games_ref = ref.child('games')
    games_list = []

    for warrior_id in warriors_ids:
        query = games_ref.order_by_child('warrior_1_id').equal_to(warrior_id).get()
        games_list.extend(query.items())

        query = games_ref.order_by_child('warrior_2_id').equal_to(warrior_id).get()
        games_list.extend(query.items())

    response = []
    for i, (game_id, game_data) in enumerate(games_list):
        warrior_1_id = game_data.get('warrior_1_id')
        warrior_2_id = game_data.get('warrior_2_id')

        warrior_1_data = warriors_ref.child(warrior_1_id).get()
        warrior_2_data = warriors_ref.child(warrior_2_id).get()

        warrior_1_name = warrior_1_data.get('name')
        warrior_2_name = warrior_2_data.get('name')

        warrior_1_wins = game_data.get('warrior_1_wins')
        warrior_2_wins = game_data.get('warrior_2_wins')

        game_info = {
            "id": game_id,
            "name": f"Game {i}",
            "warrior_1_name": warrior_1_name,
            "warrior_2_name": warrior_2_name,
            "warrior_1_wins": warrior_1_wins,
            "warrior_2_wins": warrior_2_wins
        }
        response.append(game_info)
    response.reverse()

    return jsonify(response), 200


@app.route("/new_game", methods=['POST'])
def saveGame():
    request_data = request.json
    warrior_id = request_data['warrior_id']
    games_ref = ref.child('games')
    waiting_games = games_ref.order_by_child('warrior_2_id').equal_to('').get()
    waiting_games_list = list(waiting_games.items())
    if waiting_games_list:
        found_game = waiting_games_list[0]
        game_id = found_game[0]
        warrior_1_id = found_game[1].get('warrior_1_id','')
        warrior_2_id = warrior_id
        warrior_ref = ref.child('warriors')
        warrior_1_code = warrior_ref.child(warrior_1_id).get().get('code')
        warrior_2_code = warrior_ref.child(warrior_2_id).get().get('code')
        cycles, round_winner_id, wins, core_states, exceptions = game(warrior_1_id, warrior_1_code, warrior_2_id, warrior_2_code)
        if wins[warrior_1_id] > wins[warrior_2_id]:
            #warrior_1 and it's user update
            warrior_1_wins = warrior_ref.child(warrior_1_id).get().get('won')
            warrior_ref.child(warrior_1_id).update({'won': warrior_1_wins + 1})
            warrior_1_user_id = warrior_ref.child(warrior_1_id).get().get('user_id')
            user_ref = ref.child('users').child(warrior_1_user_id)
            user_won = user_ref.child('won').get()
            user_ref.update({'won': user_won + 1})
            
            #warrior_2 and it's user update
            warrior_2_lost = warrior_ref.child(warrior_2_id).get().get('lost')
            warrior_ref.child(warrior_2_id).update({'lost': warrior_2_lost + 1})
            warrior_2_user_id = warrior_ref.child(warrior_2_id).get().get('user_id')
            user_ref = ref.child('users').child(warrior_2_user_id)
            user_lost = user_ref.child('lost').get()
            user_ref.update({'lost': user_lost + 1})
        elif wins[warrior_1_id] < wins[warrior_2_id]:
            warrior_2_wins = warrior_ref.child(warrior_2_id).get().get('won')
            warrior_ref.child(warrior_2_id).update({'won': warrior_2_wins + 1})
            warrior_2_user_id = warrior_ref.child(warrior_2_id).get().get('user_id')
            user_ref = ref.child('users').child(warrior_2_user_id)
            user_won = user_ref.child('won').get()
            user_ref.update({'won': user_won + 1})

            warrior_1_lost = warrior_ref.child(warrior_1_id).get().get('lost')
            warrior_ref.child(warrior_1_id).update({'lost': warrior_1_lost + 1})
            warrior_1_user_id = warrior_ref.child(warrior_1_id).get().get('user_id')
            user_ref = ref.child('users').child(warrior_1_user_id)
            user_lost = user_ref.child('lost').get()
            user_ref.update({'lost': user_lost + 1})
        game_data = {
                "warrior_1_id": warrior_1_id,
                "warrior_2_id": warrior_2_id,
                "warrior_1_wins": wins[warrior_1_id],
                "warrior_2_wins": wins[warrior_2_id]
            }
        games_ref.child(game_id).update(game_data)
        for r in range(10):
            round_data = {
                "round_number": r,
                "game_id": game_id,
                "cycles": cycles[r],
                "winner": round_winner_id[r],
                "error": exceptions[r]
            }
            ref.child('rounds').push(round_data)
        warrior_ref.child(warrior_1_id).update({'busy': False})
        warrior_ref.child(warrior_2_id).update({'busy': False})
        filepath = f"games_files/{game_id}.txt"
        blob = bucket.blob(filepath)
        blob.upload_from_string(core_states)
        return jsonify({"message": "The opponent was already waiting...\nYou can find results of the game in the history"}), 200
    else:
        game_data = {
            "warrior_1_id": warrior_id,
            "warrior_2_id": '',
            "warrior_1_wins": '',
            "warrior_2_wins": ''
        }
        games_ref.push(game_data)
        warriors_ref = ref.child('warriors')
        warrior_ref = warriors_ref.child(warrior_id)
        warrior_ref.update({'busy': True})
        return jsonify({"message": "Warrior is ready and is waiting for an opponent.\nYou will find his score in the history once the game ends"}), 200
    
@app.route("/get_game", methods=['GET'])
def get_game():
    game_id = request.args.get('game_id')
    games_ref = ref.child('games')
    rounds_ref = ref.child('rounds')
    games_data = games_ref.child(game_id)
    warrior1 = games_data.get().get('warrior_1_id')
    warrior2 = games_data.get().get('warrior_2_id')
    warrior_1_wins = games_data.get().get('warrior_1_wins')
    warrior_2_wins = games_data.get().get('warrior_2_wins')
    warrior_1_data = getWarrior(warrior1)
    warrior_2_data = getWarrior(warrior2)

    rounds_data = rounds_ref.order_by_child('game_id').equal_to(game_id).get()
    rounds = [
        {
            "round_number": round.get('round_number')+1,
            "cycles": round.get('cycles'),
            "winner": round.get('winner'),
            "error": round.get('error'),
        }
        for round in rounds_data.values()
    ]
    blob = bucket.blob(f"games_files/{game_id}.txt")
    grid_data = blob.download_as_string().decode('utf-8')
    response_full = {
        "id": game_id,
        "warrior_1_id": warrior1,
        "warrior_1_name": warrior_1_data.name,
        "warrior_1_code": warrior_1_data.code,
        "warrior_1_wins": warrior_1_wins,
        "warrior_2_id": warrior2,
        "warrior_2_name": warrior_2_data.name,
        "warrior_2_code": warrior_2_data.code,
        "warrior_2_wins": warrior_2_wins,
        "rounds": rounds,
        "grid_data": grid_data
    }
    return jsonify(response_full), 200

@app.route('/getGameInfo', methods=['GET'])
def getGameInfo():
    request_data = request.json
    game_id = request_data['game_id']
    response = get_game(game_id)
    return jsonify(response), 200

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
