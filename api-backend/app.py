from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}, r"/login": {"origins": "http://localhost:3000"}, r"/verify": {"origins": "http://localhost:3000"}})

MODEL_PATH = 'models/model.joblib'

def preprocess_data(data):
    # Check for specific columns in the input data
    features = ['spectroFlux_u', 'spectroFlux_g', 'spectroFlux_r', 'spectroFlux_i', 'spectroFlux_z', 'spectroSynFlux_u', 
                'spectroSynFlux_g', 'spectroSynFlux_r', 'spectroSynFlux_i', 'spectroSynFlux_z', 'spectroFluxIvar_u', 
                'spectroFluxIvar_g', 'spectroFluxIvar_r', 'spectroFluxIvar_i', 'spectroFluxIvar_z', 'spectroSynFluxIvar_u', 
                'spectroSynFluxIvar_g', 'spectroSynFluxIvar_r', 'spectroSynFluxIvar_i', 'spectroSynFluxIvar_z', 'spectroSkyFlux_u', 
                'spectroSkyFlux_g', 'spectroSkyFlux_r', 'spectroSkyFlux_i', 'spectroSkyFlux_z']

    if not all(feature in data.columns for feature in features):
        return jsonify({'message': 'One or more features missing'}), 400
    
    # Filter the input data to only include the required columns
    data = data[features]

    # Clean the data
    data.dropna(inplace=True)
    
    #numpy array
    data = data.to_numpy()

    # Scale the data
    scaler = StandardScaler()
    data = scaler.fit_transform(data)

    return data

@app.route('/predict', methods=['POST'])
def predict():
    # Check if the request has a file attached
    if 'csvFile' not in request.files:
        return jsonify({'message': 'No file attached'}), 400
    
    # Get the csv file from the request
    csv_file = request.files['csvFile']

    # Check if the file is empty or file type is not csv
    if csv_file.filename == '' or not csv_file.filename.endswith('.csv'):
        return jsonify({'message': 'Invalid file'}), 400
    
    # Save the csv file to the uploads folder
    csv_file.save('uploads/' + csv_file.filename)

    # Read the csv file into a pandas dataframe
    try:
        data = pd.read_csv('uploads/' + csv_file.filename)
    except:
        return jsonify({'message': 'Error passing csv file'}), 400
    
    # Preprocess the input data
    data = preprocess_data(data)

    # Load the model
    model = joblib.load(MODEL_PATH)

    # Make prediction
    predictions = model.predict(data)

    # Convert the predictions to class names
    predictions = np.argmax(predictions, axis=1)

    # Map the prediction to class names
    predictions = [map_prediction_to_class(prediction) for prediction in predictions]

    # Remove the csv file from the uploads folder
    os.remove('uploads/' + csv_file.filename)

    # Return the prediction as a csv file
    return jsonify({'predictions': predictions}), 200

def map_prediction_to_class(prediction):
    class_names = ['A', 'B', 'F', 'G', 'K', 'M', 'O']
    return class_names[prediction]

users = {
    'indunil': {"password": "1234"},
    'john': {"password": "1234"}
}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if username or password is missing
    if not username or not password:
        return jsonify({'message': 'Missing data'}), 400

    # Check the user's credentials from json file
    if username in users and users[username]['password'] == password:
        token = bcrypt.hashpw(username.encode('utf-8'), bcrypt.gensalt())
        return jsonify({'user': username, 'accessToken': token.decode('utf-8')}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 400 
    
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    accessToken = data['accessToken']

    # Check if token is missing
    if not accessToken:
        return jsonify({'message': 'Missing data'}), 400

    # Check the user's credentials from json file
    for user in users:
        print(user)
        if bcrypt.checkpw(user.encode('utf-8'), accessToken.encode('utf-8')):
            return jsonify({'user': user}), 200
    
    return jsonify({'message': 'Invalid token'}), 400

if __name__ == '__main__':
    app.run(debug=True)