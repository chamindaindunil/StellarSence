import './App.css';
import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from 'react-bootstrap';
import axios from 'axios';
import Login from './components/login';
import CSVFileInput from './components/CSVFileInput';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeComponent, setActiveComponent] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.post('http://127.0.0.1:5000/verify', {
        Headers: {
          'Access-Control-Allow-Origin': '*', // Allow CORS
          'Content-Type': 'application/json'
        },
        accessToken: accessToken
      })
      .then(response => {
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          const error = new Error(response.error);
          console.log(error);
        }
      })
      .catch(err => console.log('Login failed:', err.message));
    }
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    setActiveComponent('login');
  };

  const handleHomeClick = () => {
    setActiveComponent('');
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'login':
        return <Login />;
      default:
        return <CSVFileInput />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');

    setIsLoggedIn(false);

    setActiveComponent('');
  };

  return (
    <div className="App">
      <header>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home" onClick={handleHomeClick}>StellarSence</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
          <Nav>
            {isLoggedIn ? (
              <>
                <Nav.Link href="#logout" onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="#login" onClick={handleLoginClick}>Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      </header>
      <main>
        {renderActiveComponent()}
      </main>
      <footer className="footer">
        <Container>
          <p className="text-light text-center">© 2023 StellarSence. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
