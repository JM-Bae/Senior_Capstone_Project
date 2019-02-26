import time
import sys, os
sys.path.append('C:/Users/JMB/Desktop/GIT/Senior_Capstone_Project/emotion_detection/utils')
import globals as globe
from .pyre import firebase

def background_timer():
    starttime = time.time()
    while not globe.exit_flag:
        time.sleep(30.0 - ((time.time() - starttime)% 30.0))
        globe.thread_busy = False
        
def push_batch(data):
    while not globe.exit_flag:
        firebase(data.iloc[0])
        print(data.iloc[0])

    