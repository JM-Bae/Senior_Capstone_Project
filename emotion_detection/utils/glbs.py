from queue import Queue

def init():
    global exit_flag
    exit_flag = False
    global thread_busy
    thread_busy = True
    global Batch_Q
    Batch_Q = Queue()