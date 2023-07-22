import firebase_admin
from firebase_admin import credentials, firestore, auth, storage


from flask import Flask, request, jsonify, send_file, make_response
from functions import predict_audio, display_audio_transcript, capitalize_text
from deepmultilingualpunctuation import PunctuationModel
from tensorflow.keras.models import load_model
from deepmultilingualpunctuation import PunctuationModel
from flask_bcrypt import Bcrypt
from flask_cors import CORS

bcrypt = Bcrypt()

import librosa
import os
import traceback
import json
import tensorflow as tf
import numpy as np
import pyttsx3
import tempfile
import requests
import uuid


cred = credentials.Certificate("illegible-speech-recognition-firebase-adminsdk-i0d1w-4e41997e66.json")
firebase_admin.initialize_app(cred, {'storageBucket':'illegible-speech-recognition.appspot.com'})

# # Initialize the Firestore and Storage client
db = firestore.client()
bucket = storage.bucket()

# create an instance of a Flask object
app = Flask(__name__)
CORS(app)
# cors = CORS(app, resources={r"/*": {"origins": "*"}})

# CORS(app, methods=["GET", "POST"], allow_headers=["Content-Type"], origins="*")  # Enable CORS for all routes

@app.route("/signup", methods=["POST", "OPTIONS"])
def sign_up():
    # Get the username, password, and date of birth from the request data
    email = request.form.get("email")
    username = request.form.get("username")
    password = request.form.get("password")

    try:
        # Create a new user in Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password
        )

        # Store the user data in Firestore
        db = firestore.client()
        user_ref = db.collection("users").document(user.uid)
        user_ref.set({
            "user_id": user.uid,  # Save the user ID in the "users" collection
            "email": email,
            "username": username,
            "password": password,
        })

        # Store additional user data in Firestore or Realtime Database (if required)
        response = make_response('User created successfully', 200)

        response.headers['Access-Control-Allow-Origin'] = '*'  # Set the CORS header


        return "User created successfully", 200

    except Exception as e:
        return str(e), 400




@app.route('/signin', methods=['POST'])
def signin():
    # Get the username and password from the request
    username = request.json.get('username')
    password = request.json.get('password')

    try:
        # Query the Firestore collection for the user by username
        db = firestore.client()
        users_ref = db.collection('users')
        query = users_ref.where('username', '==', username).limit(1)
        result = query.get()

        if len(result) == 1:
            # Get the user document
            user_doc = result[0]

            # Verify the password
            if user_doc.get('password') == password:
                # Sign in successful
                user_id = user_doc.id  # Get the user ID
                return jsonify({'message': 'Sign in successful', 'user_id': user_id}), 200
            else:
                # Invalid password
                return jsonify({'error': 'Invalid password'}), 401
        else:
            # User not found
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        # Handle any errors
        return jsonify({'error': str(e)}), 500



SAVED_MODEL_PATH = "ASR_model.h5"  # Path to your trained model
JSON_PATH = "data.json"  # Path to your mapping JSON file

punct_model = PunctuationModel(model="oliverguhr/fullstop-punctuation-multilingual-sonar-base")

# Load the trained model
model = load_model(SAVED_MODEL_PATH)

# Load the mapping from the JSON file
with open(JSON_PATH, "r") as fp:
    data = json.load(fp)
    mapping = data["mapping"]



@app.route('/speech-recognition', methods=["POST"])
def predict_audio_():
    file = request.files["audio"]
    user_id = request.form.get("user_id")  # Get the user ID from the request data

    # Perform audio processing and transcription
    predicted_label = predict_audio(model, file, mapping)
    punctuated_text = punct_model.restore_punctuation(format(predicted_label))

    # Generate a unique output ID for the user output
    output_id = str(uuid.uuid4())

    # Save the punctuated text to the user's subcollection in Firestore
    user_ref = db.collection("users").document(user_id)
    user_output_ref = user_ref.collection("user_output").document(output_id)
    user_output_ref.set({
        "text": punctuated_text,
        "audio_url": ""  # Placeholder for audio URL
    })

    # Convert the punctuated text to speech
    output_file = f"output_{output_id}.wav"  # Unique output file name for each user_output ID
    output_path = os.path.join("audios", output_file)

    engine = pyttsx3.init()
    engine.save_to_file(punctuated_text, output_path)
    engine.runAndWait()

    # Upload the audio file to Firestore Storage
    audio_blob = bucket.blob(output_file)
    audio_blob.upload_from_filename(output_path)

    # Get the public URL of the uploaded audio file
    audio_url = audio_blob.public_url

    # Update the document with the audio URL
    user_output_ref.update({
        "audio_url": audio_url
    })

    return jsonify({"output_id": output_id, "text": punctuated_text, "audio_url": audio_url}), 200



import traceback
@app.route("/audio/<user_id>/<output_id>", methods=["GET"])
def get_audio(user_id, output_id):
    try:
        # Retrieve the audio URL from Firestore based on the user ID and output ID
        user_output_ref = db.collection("users").document(user_id).collection("user_output").document(output_id)
        doc = user_output_ref.get()
        audio_url = doc.get("audio_url")

        print("User ID:", user_id)
        print("Output ID:", output_id)
        print("Audio URL:", audio_url)

        # Download the audio file locally
        response = requests.get(audio_url)
        print("checkpoint 1")

        file_path = f"audios/{user_id}_{output_id}.wav"  # Set the desired local file path
        print("checkpoint 2")

        if not os.path.exists("audios"):
            os.makedirs("audios")
            print("checkpoint 3")

        with open(file_path, "wb") as file:
            print("checkpoint 4")
            file.write(response.content)

        # Return the audio file as a response with the correct MIME type
        return send_file(file_path, mimetype="audio/wav")

    except Exception as e:
        print("Error:", str(e))
        print(traceback.format_exc())

        # Return an error response
        return "Error occurred", 500






if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
