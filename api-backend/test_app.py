import pytest
import requests
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

def test_login(client):
    # Send a POST request with a valid username and password to the login endpoint
    data = {'username': 'indunil', 'password': '1234'}
    response = client.post('/login', json=data)

    # Validate that the response has the correct status code and data
    assert response.status_code == 200

    # Validate that the response is correct
    response_data = response.get_json()
    assert 'access_token' in response_data

def test_login_invalid(client):
    # Send a POST request with an invalid username and password to the login endpoint
    data = {'username': 'Indunil', 'password': 'wrong_password'}
    response = client.post('/login', json=data)

    # Validate that the response has the unauthorized status code
    assert response.status_code == 400

    # Validate that the response is correct
    expected_data = {"message": "Invalid credentials"}
    assert response.json == expected_data

def test_login_missing_data(client):
    # Send a POST request with a missing username and password to the login endpoint
    data = {'username': '', 'password': ''}
    response = client.post('/login', json=data)

    # Validate that the response has the bad request status code
    assert response.status_code == 400

    # Validate that the response is correct
    expected_data = {"message": "Missing data"}
    assert response.json == expected_data

def test_valid_prediction(client):
    # Send a POST request with valid file to the predict endpoint
    data = {'csvFile': open('test_data.csv', 'rb')}

    response = client.post('/predict', data=data)

    # Validate that the response has the correct status code and data
    assert response.status_code == 200

    # Validate that the response is correct
    response_data = response.get_json()
    assert 'prediction_class' in response_data

    # Validate that the response contains the correct prediction
    assert response_data['prediction_class'] in ['A', 'B', 'F', 'G', 'K', 'M', 'O']

def test_prediction_missing_data(client):
    # Send a POST request with no data to the predict endpoint
    response = client.post('/predict')

    # Validate that the response has the bad request status code
    assert response.status_code == 400

    # Validate that the response is correct
    expected_data = {"message": "No file attached"}
    assert response.json == expected_data

def test_prediction_invalid_data(client):
    # Send a POST request with invalid file to the predict endpoint
    data = {'csvFile': open('test_data_invalid.csv', 'rb')}

    response = client.post('/predict', data=data)

    # Validate that the response has the bad request status code
    assert response.status_code == 400

    # Validate that the response is incorrect
    expected_data = {"message": "Error passing csv file"}
    assert response.json == expected_data

def test_prediction_invalid_file_type(client):
    # Send a POST request with invalid file type to the predict endpoint
    data = {'csvFile': open('test_data_invalid.txt', 'rb')}

    response = client.post('/predict', data=data)

    # Validate that the response has the bad request status code
    assert response.status_code == 400

    # Validate that the response is incorrect
    expected_data = {"message": "Invalid file"}
    assert response.json == expected_data