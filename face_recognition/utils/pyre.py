import os
import argparse
import base64
import json
import pandas as pd
import numpy as np
import pyrebase

from googleapiclient import discovery
from oauth2client.client import GoogleCredentials

os.system("export GOOGLE_APPLICATION_CREDENTIALS=RP3VISION-59b8375d66b9.json")

def firebase(x1,x2,y1,y2):
    
   with open('Output_File.json') as f:
      data = json.load(f)

   config = {
     "apiKey": "AIzaSyDeoBpT_LE_ABbneoeoYSWVcavpZbxse78",
     "authDomain": "emotion-recognition-database.firebaseapp.com",
     "databaseURL": "https://emotion-recognition-database.firebaseio.com",
     "storageBucket": "emotion-recognition-database.appspot.com"
   }

   firebase = pyrebase.initialize_app(config)
   firebase.database()

   db = firebase.database()
   '''
   data = {
	   "joyLikelihood": data["responses"][0]["faceAnnotations"][0]["joyLikelihood"],
           "sorrowLikelihood": data["responses"][0]["faceAnnotations"][0]["sorrowLikelihood"],
	   "angerLikelihood": data["responses"][0]["faceAnnotations"][0]["angerLikelihood"],
           "underExposedLikelihood": data["responses"][0]["faceAnnotations"][0]["underExposedLikelihood"],
           "surpriseLikelihood": data["responses"][0]["faceAnnotations"][0]["surpriseLikelihood"],
           "blurredLikelihood": data["responses"][0]["faceAnnotations"][0]["blurredLikelihood"],
           "headwearLikelihood": data["responses"][0]["faceAnnotations"][0]["headwearLikelihood"]
   }
   ''' 
   data = {
       "X1": x1, "X2": x2, "Y1": y1, "Y2": y2
   }
   db.child("users").push(data)
