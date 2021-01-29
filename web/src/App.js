import React, { useState } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [nameReg, setNameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [loginStatus, setLoginStatus] = useState(false);

  Axios.defaults.withCredentials = true;

  function register() {
    Axios.post('http://localhost:3001/register', { 
      name: nameReg, 
      password: passwordReg
    }).then((res) => {
      console.log(res);
    });
  }
  
  function login() {
    Axios.post('http://localhost:3001/login', { 
      name: name, 
      password: password
    }).then((res) => {
      if (!res.data.auth) {
        setLoginStatus(false);
      } else {
        localStorage.setItem('token', 'Bearer ' + res.data.token);
        setLoginStatus(true);
      }
    });
  }

  function userAuthenticated() {
    Axios.get('http://localhost:3001/isUserAuth', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      }
    }).then((res) => {
      console.log(res);
    });
  }

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <label>Name</label>
        <input 
          type="text" 
          value={nameReg}
          onChange={e => {setNameReg(e.target.value)}} 
        />

        <label>Password</label>
        <input 
          type="text" 
          value={passwordReg}
          onChange={e => {setPasswordReg(e.target.value)}} 
        />
        <button
          onClick={register}
        >
          Register
        </button>
      </div>

      <div className="login">
        <h1>Login</h1>
        <label>Name</label>
        <input 
          type="text" 
          placeholder="Username..."
          value={name}
          onChange={e => {setName(e.target.value)}}  
        />

        <label>Password</label>
        <input 
          type="text" 
          placeholder="Password..." 
          value={password}
          onChange={e => {setPassword(e.target.value)}} 
        />
        <button onClick={login}>Login</button>
      </div>

      {loginStatus && (
        <button onClick={userAuthenticated}>
          Check if authenticated
        </button>
      )}
    </div>
  );
}

export default App;
