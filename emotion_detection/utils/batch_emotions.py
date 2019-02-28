import time
import sys, os
sys.path.append('C:/Users/JMB/Desktop/GIT/Senior_Capstone_Project/emotion_detection/utils')

from pyre import firebase
from queue import Queue

Batch_Q = Queue()
exit_flag = None
thread_busy = True

def background_timer():
    global exit_flag
    starttime = time.time()
    while not exit_flag:
        time.sleep(10.0 - ((time.time() - starttime)% 10.0))
        setthreadflag(False)
        push_batch()
        print('tick')
        print(thread_busy)

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
    #global thread_busy
    global Batch_Q
    if not Batch_Q.empty():
        data = Batch_Q.get()
        firebase(data.iloc[0]["emotions"])
        print(data.iloc[0])

        #print(thread_busy)
    return 

    