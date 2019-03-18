import sys
import os
import time
from queue import Queue
import pyrebase


Batch_Q = Queue()
exit_flag = None
thread_busy = True

def firebase(emotion, timestamp, certainty_val):
    config = {
        "apiKey": "AIzaSyDeoBpT_LE_ABbneoeoYSWVcavpZbxse78",
        "authDomain": "emotion-recognition-database.firebaseapp.com",
        "databaseURL": "https://emotion-recognition-database.firebaseio.com",
        "storageBucket": "emotion-recognition-database.appspot.com"
    }

    firebase = pyrebase.initialize_app(config)
    firebase.database()

    db = firebase.database()
    refKey = db.generate_key()

    data = {
       "events/"+refKey: {
       "emotion": emotion,
       "timestamp": timestamp,
       "certainty": certainty_val
    },
    "emotions/"+emotion+"/"+refKey: {
       "timestamp": timestamp,
       "certainty": certainty_val
        }
    }
    db.update(data)
#    db.child("emotions").child(emotion).child(refKey).set(data2)


def background_timer():
    global exit_flag
    starttime = time.time()

    while not exit_flag:
        time.sleep(5.0 - ((time.time() - starttime)% 5.0))
        setthreadflag(False)
        push_batch()

def setexitflag(exit):
    global exit_flag

    if exit:
        exit_flag = True  
    else:
        exit_flag = False

def getthreadflag():
    global thread_busy
    return thread_busy

def setthreadflag(exit):
    global thread_busy

    if exit:
        thread_busy = True
    else:
        thread_busy = False
        
def push_batch():
    global Batch_Q
    global certainty_val

    
    if not Batch_Q.empty():
        data = Batch_Q.get()
        firebase(data.iloc[0]["emotions"], data.iloc[0]["TimeStamp"], data.iloc[0]["certainty"])
        
        # print data locally
        #print(data.iloc[0])

    
