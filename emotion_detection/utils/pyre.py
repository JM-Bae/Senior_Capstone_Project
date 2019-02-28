import pyrebase
import time

# https://console.firebase.google.com/u/0/project/emotion-recognition-database/database/emotion-recognition-database/data


def firebase(emotion):

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
       "emotions": emotion
    }

    db.child("users").push(data)


if __name__ == "__main__":

    firebase("sad")
