import pyrebase

# https://console.firebase.google.com/u/0/project/emotion-recognition-database/database/emotion-recognition-database/data

def firebase():
    
   config = {
     "apiKey": "AIzaSyDeoBpT_LE_ABbneoeoYSWVcavpZbxse78",
     "authDomain": "emotion-recognition-database.firebaseapp.com",
     "databaseURL": "https://emotion-recognition-database.firebaseio.com",
     "storageBucket": "emotion-recognition-database.appspot.com"
   }

   firebase = pyrebase.initialize_app(config)
   firebase.database()

   db = firebase.database()
   data = {
	   "joyLikelihood": "test",
           "sorrowLikelihood": "test",
	   "angerLikelihood": "test",
           "underExposedLikelihood": "test",
           "surpriseLikelihood": "test",
           "blurredLikelihood": "test",
           "headwearLikelihood": "test"
   }

   db.child("users").push(data)

firebase()
