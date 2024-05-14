import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


cred = credentials.Certificate("corewars-48cd2-firebase-adminsdk-tyekb-3eddbce5b0.json")
databaseURL = 'https://corewars-48cd2-default-rtdb.europe-west1.firebasedatabase.app/'
firebase_admin.initialize_app(cred,{
	'databaseURL':databaseURL
	})

ref = db.reference("/")
