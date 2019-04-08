from statistics import mode
from threading import Thread
import cv2
from keras.models import load_model
import numpy as np
import pandas as pd
import datetime
import RPi.GPIO as GPIO
import time

from utils.datasets import get_labels
from utils.inference import detect_faces
from utils.inference import draw_text
from utils.inference import draw_bounding_box
from utils.inference import apply_offsets
from utils.inference import load_detection_model
from utils.preprocessor import preprocess_input
from utils.export_data import push_batch, background_timer
from utils.export_data import getthreadflag, setexitflag, setthreadflag
from utils.export_data import exit_flag, thread_busy, Batch_Q


GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(4,GPIO.IN)

reopenWindow = 0

if __name__ == "__main__":
    # global variables
    global exit_flag
    global thread_busy
    global Batch_Q

    # initialize global variables
    setexitflag(False)
    setthreadflag(True)

    # parameters for loading data and images
    detection_model_path = 'models/haarcascade_frontalface_default.xml'
    emotion_model_path = 'models/fer2013_mini_XCEPTION.102-0.66.hdf5'
    emotion_labels = get_labels('fer2013')

    # hyper-parameters for bounding boxes shape
    frame_window = 10
    emotion_offsets = (20, 40)

    # loading models
    face_detection = load_detection_model(detection_model_path)
    emotion_classifier = load_model(emotion_model_path, compile=False)

    # getting input model shapes for inference
    emotion_target_size = emotion_classifier.input_shape[1:3]

    # starting lists for calculating modes
    emotion_window = []

    # dataframe to hold batch emotion data
    emotion_data = pd.DataFrame()
    emotions = []

    # kick off external thread to push data to firebase
    timer = Thread(target=background_timer)
    timer.start()


    # starting video streaming
    cv2.namedWindow('E.D.D.', cv2.WND_PROP_FULLSCREEN) #cv2.WINDOW_NORMAL)
    cv2.setWindowProperty('E.D.D.', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

    cv2.resizeWindow('E.D.D.', 600,480)
    image = cv2.imread('image.PNG')
   
    video_capture = cv2.VideoCapture(0)

    video_capture.set(4,150)
    video_capture.set(3,150)


    while video_capture.isOpened():
        reopenWindow = 0
        _, bgr_image = video_capture.read()
        gray_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
        rgb_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)
        faces = detect_faces(face_detection, gray_image)

        if len(faces):
            x1, x2, y1, y2 = apply_offsets(faces[0], emotion_offsets)
            gray_face = gray_image[y1:y2, x1:x2]
            try:
                gray_face = cv2.resize(gray_face, (emotion_target_size))
            except:
                continue

            gray_face = preprocess_input(gray_face, True)
            gray_face = np.expand_dims(gray_face, 0)
            gray_face = np.expand_dims(gray_face, -1)
            emotion_prediction = emotion_classifier.predict(gray_face)
            emotion_probability = np.max(emotion_prediction)
            emotion_label_arg = np.argmax(emotion_prediction)
            emotion_text = emotion_labels[emotion_label_arg]
            emotion_window.append(emotion_text)

            if len(emotion_window) > frame_window:
                emotion_window.pop(0)
            try:
                emotion_mode = mode(emotion_window)
            except:
                continue

            if emotion_text == 'angry':
                color = emotion_probability * np.asarray((255, 0, 0))
            elif emotion_text == 'sad':
                color = emotion_probability * np.asarray((0, 0, 255))
            elif emotion_text == 'happy':
                color = emotion_probability * np.asarray((255, 255, 0))
            elif emotion_text == 'surprise':
                color = emotion_probability * np.asarray((0, 255, 255))
            else:
                color = emotion_probability * np.asarray((0, 255, 0))


            color = color.astype(int)
            color = color.tolist()

            draw_bounding_box(faces[0], rgb_image, color)
            draw_text(faces[0], rgb_image, emotion_mode,
                    color, 0, -5, 0.5, 1)

            # Batch Process Emotions
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            emotions.append([emotion_text,now,emotion_probability])



            if (not getthreadflag()):
                emotion_data = pd.DataFrame(emotions, columns=['emotions','TimeStamp','certainty'])
                Batch_Q.put(emotion_data)
                setthreadflag(True)
                emotions = []



        bgr_image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2BGR)

        cv2.imshow('E.D.D.', bgr_image)


        while GPIO.input(4) == True:
           
            cv2.destroyWindow('E.D.D.')
            cv2.waitKey(1)
            cv2.namedWindow('User Not Detected', cv2.WND_PROP_FULLSCREEN) #cv2.WINDOW_NORMAL)
            cv2.setWindowProperty('User Not Detected', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)


            cv2.imshow('User Not Detected', image)
            reopenWindow = 1


        if reopenWindow == 1 and GPIO.input(4) == False:

            cv2.destroyWindow('User Not Detected')
            cv2.waitKey(1)


            cv2.namedWindow('E.D.D.', cv2.WND_PROP_FULLSCREEN) #cv2.WINDOW_NORMAL)
            cv2.setWindowProperty('E.D.D.', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)


            cv2.resizeWindow('E.D.D.', 600,480)
            reopenWindow = 0

        if cv2.waitKey(1) & 0xFF == ord('q'):
            setexitflag(True)
            timer.join()
            break

