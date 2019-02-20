"""
Google Vision API Tutorial with a Raspberry Pi and Raspberry Pi Camera.  See more about it here:  https://www.dexterindustries.com/howto/use-google-cloud-vision-on-the-raspberry-pi/

Use Google Cloud Vision on the Raspberry Pi to take a picture with the Raspberry Pi Camera and classify it with the Google Cloud Vision API.   First, we'll walk you through setting up the Google Cloud Platform.  Next, we will use the Raspberry Pi Camera to take a picture of an object, and then use the Raspberry Pi to upload the picture taken to Google Cloud.  We can analyze the picture and return labels (what's going on in the picture), logos (company logos that are in the picture) and faces.

This script uses the Vision API's label detection capabilities to find a label
based on an image's content.

"""
import os
import argparse
import base64
import picamera
import json
import pandas as pd
import numpy as np
import pyrebase


from googleapiclient import discovery
from oauth2client.client import GoogleCredentials

os.system("export GOOGLE_APPLICATION_CREDENTIALS=RP3VISION-59b8375d66b9.json")

def takephoto():
    camera = picamera.PiCamera()
    camera.capture('image.jpg')

def firebase():
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
   data = {
	   "joyLikelihood": data["responses"][0]["faceAnnotations"][0]["joyLikelihood"],
           "sorrowLikelihood": data["responses"][0]["faceAnnotations"][0]["sorrowLikelihood"],
	   "angerLikelihood": data["responses"][0]["faceAnnotations"][0]["angerLikelihood"],
           "underExposedLikelihood": data["responses"][0]["faceAnnotations"][0]["underExposedLikelihood"],
           "surpriseLikelihood": data["responses"][0]["faceAnnotations"][0]["surpriseLikelihood"],
           "blurredLikelihood": data["responses"][0]["faceAnnotations"][0]["blurredLikelihood"],
           "headwearLikelihood": data["responses"][0]["faceAnnotations"][0]["headwearLikelihood"]
   }

   db.child("users").push(data)

if __name__ == '__main__':
    
    takephoto() # First take a picture
    """Run a label request on a single image"""

    credentials = GoogleCredentials.get_application_default()
    service = discovery.build('vision', 'v1', credentials=credentials)

    with open('image.jpg', 'rb') as image:
        image_content = base64.b64encode(image.read())
        service_request = service.images().annotate(body={
            'requests': [{
                'image': {
                    'content': image_content.decode('UTF-8')
                },
                'features': [{
                    'type': 'FACE_DETECTION',
                    'maxResults': 10
                }]
            }]
        })
        response = service_request.execute()
        fo = open("Output_File.json", "w")

        #Print it out and make it somewhat pretty.
        fo.write(json.dumps(response, indent=4, sort_keys=True))	
            
    firebase()