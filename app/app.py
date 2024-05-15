import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
import secrets
from collections import deque
from passlib.hash import pbkdf2_sha256
import sqlite3
import os
import time
import zxcvbn
import re
from base64 import b64encode
from io import BytesIO

cred = credentials.Certificate("corewars-48cd2-firebase-adminsdk-tyekb-3eddbce5b0.json")
databaseURL = 'https://corewars-48cd2-default-rtdb.europe-west1.firebasedatabase.app/'
firebase_admin.initialize_app(cred,{
	'databaseURL':databaseURL
	})

ref = db.reference("/")


app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)

app.secret_key = "9D9639B4D842CBAB1C972D8EDA2D123E3242D9ABEF61F3EB55B4CC8AAD"

class User(UserMixin):
    pass


@app.route('/check_password_strength', methods=['POST'])
def check_password_strength_route():
    try:
        password = request.json['password']
        strength, conditions = calculate_password_strength(password)
        return jsonify({'strength': strength, 'conditions' : conditions})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


def password_condictions(password):
    length_condition = len(password) >= 8
    uppercase_condition = bool(re.search(r'[A-Z]', password))
    lowercase_condition = bool(re.search(r'[a-z]', password))
    digit_condition = bool(re.search(r'\d', password))
    special_char_condition = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    password_strength = zxcvbn.zxcvbn(password)
    entropy_condition = length_condition and password_strength['score'] < 3

    return [length_condition, uppercase_condition, lowercase_condition, digit_condition, special_char_condition, entropy_condition]


def calculate_password_strength(password):
    conditions = password_condictions(password)
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
        name = request.form["name"]
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
                error = 'The username was already taken'
                return render_template("register.html", error=error)
            else:
                salt = generate_salt()
                hashed_password = hash_password(password, salt)
                user_data = {
					"email": email,
					"password": hashed_password,
					"name": name,
					"won": 0,
					"lost": 0
				}
                ref.child('users').push(user_data)
                return None
        else:
            error = 'Passwords do not match'
            return render_template("register.html", error=error)


def random():
    random_value = secrets.randbelow(1000) / 1000
    return random_value


@login_manager.user_loader
def user_loader(email):
    if email is None:
        return None

    users_ref = ref.child('users')
    query = users_ref.order_by_child('email').equal_to(email).limit_to_first(1)
    results = query.get()

    if results:
        user_id = list(results.keys())[0]
        user_data = results[user_id]

    user = User()
    user.id = user_id
    user.password = user_data["password"]
    user.name = user_data["name"]
    user.won = user_data["won"]
    user.lost = user_data["lost"]
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    user = user_loader(email)
    return user


def verify_password(provided_password, stored_password):
    return pbkdf2_sha256.verify(provided_password, stored_password)


recent_users = deque(maxlen=3)


@app.route("/", methods=["GET","POST"])
def login():
    if request.method == "GET":
        return render_template("index.html")
    if request.method == "POST":
        username = request.form.get("email")
        password = request.form.get("password")

        user = user_loader(username)

        if user is None:
            error = "Incorrect login details"
            time.sleep(random())
            return render_template("index.html", error=error)

        if verify_password(password, user.password):
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
        name = current_user.name

        return render_template("hello.html", name=name)


if __name__ == "__main__":

    app.run(debug=True)