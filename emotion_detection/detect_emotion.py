from statistics import mode
from threading import Thread
import cv2
from keras.models import load_model
import numpy as np
import pandas as pd
import datetime, time

from utils.datasets import get_labels
from utils.inference import detect_faces
from utils.inference import draw_text
from utils.inference import draw_bounding_box
from utils.inference import apply_offsets
from utils.inference import load_detection_model
from utils.preprocessor import preprocess_input
from utils.pyre import firebase
from utils.batch_emotions import push_batch, getthreadflag
from utils.batch_emotions import background_timer, setexitflag, setthreadflag
from utils.batch_emotions import exit_flag, thread_busy, Batch_Q
#import utils.glbs as glbs

if __name__ == "__main__":
    global exit_flag
    global thread_busy
    global Batch_Q

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

    emotion_data = pd.DataFrame()
    emotions = []
    timer = Thread(target=background_timer)
    timer.start()
#    thread = Thread(target = push_batch)
#    thread.start()    

    # starting video streaming
    cv2.namedWindow('window_frame')
    video_capture = cv2.VideoCapture(0)

    while video_capture.isOpened():
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
                    color, 0, -45, 1, 1)

            # Batch Process Emotions
            emotions.append([emotion_text,str(datetime.datetime.now())])

            if (not getthreadflag()):
                emotion_data = pd.DataFrame(emotions, columns=['emotions','TimeStamp'])
                Batch_Q.put(emotion_data)
                
                setthreadflag(True)                            
                emotions = []
                print("Testing")
                print(thread_busy)

        bgr_image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2BGR)
        cv2.imshow('window_frame', bgr_image)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            setexitflag(True)
            break
    timer.join()
