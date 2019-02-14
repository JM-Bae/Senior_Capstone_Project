import cv2
import numpy as np
from statistics import mode
from utils.inference import detect_faces
from utils.inference import draw_bounding_box
from utils.inference import apply_offsets
from utils.preprocessor import preprocess_input

from utils.pyre import firebase

# hyperparameters
frame_window = 10
emotion_offsets = (20, 40)

# loading models
face_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')

# starting lists for calculating modes
emotion_window = []

# starting video streaming
cv2.namedWindow('window_frame')

# webcam feed
cap = cv2.VideoCapture(0) # Webcam source

while cap.isOpened(): # True:
    ret, bgr_image = cap.read()

    gray_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
    rgb_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)

    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5,
			minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

   # for face_coordinates in faces:
    if len(faces):
        x1, x2, y1, y2 = apply_offsets(faces[0], emotion_offsets)
        gray_face = gray_image[y1:y2, x1:x2]
        gray_face = preprocess_input(gray_face, True)
        gray_face = np.expand_dims(gray_face, 0)
        gray_face = np.expand_dims(gray_face, -1)

        color = np.asarray((255,0,0))
        color = color.astype(int)
        color = color.tolist()

        draw_bounding_box(faces[0], rgb_image, color)

    bgr_image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2BGR)
    cv2.imshow('window_frame', bgr_image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
