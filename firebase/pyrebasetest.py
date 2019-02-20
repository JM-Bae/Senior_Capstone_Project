import pyrebase
import time

# https://console.firebase.google.com/u/0/project/emotion-recognition-database/database/emotion-recognition-database/data

def firebase(num):
    
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
	   "joyLikelihood": str(num),
           "sorrowLikelihood": "test",
	   "angerLikelihood": "test",
           "underExposedLikelihood": "test",
           "surpriseLikelihood": "test",
           "blurredLikelihood": "test",
           "headwearLikelihood": "test"
   }

   db.child("users").child("LZ73PhbxtQxeCKIL8UN").push(data)

if __name__ == "__main__":

  for i in range(5):
    firebase(i)
    time.sleep(.5)
