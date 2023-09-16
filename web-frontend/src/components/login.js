import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { useState } from "react";
import axios from 'axios';
import './css/login.css'

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    axios.post('http://127.0.0.1:5000/login', {
      Headers: {
        'Access-Control-Allow-Origin': '*', // Allow CORS
        'Content-Type': 'application/json'
      },
      username: username,
      password: password
    })
    .then(response => {
      if (response.status === 200) {
        setIsLoggedIn(true);
        const accessToken = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
      } else {
        const error = new Error(response.error);
        console.log(error);
      }
    })
    .catch(err => console.log('Login failed:', err.message));
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <h4 className="mt-1 mb-5 pb-1">Stellarsence: Your Celestial Guide</h4>
            </div>
            <p>Please login to your account</p>
            <MDBInput wrapperClass='mb-4' label='User Name' id='username' type='text' onChange={handleUsernameChange} />
            <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' onChange={handlePasswordChange} />
            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleLogin}>Sign in</MDBBtn>
              <a className="text-muted" href="#!">Forgot password?</a>
            </div>
          </div>
        </MDBCol>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">Unlock the Mysteries of the Night Sky</h4>
              <p className="small mb-0">Welcome to Stellarsence, your ultimate star identification system that brings the wonders 
              of the night sky right to your fingertips. Whether you're an amateur stargazer, a seasoned astronomer, or just 
              someone who marvels at the beauty of the cosmos, Stellarsence is your celestial guide to understanding and 
              identifying stars like never before.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}

export default Login;