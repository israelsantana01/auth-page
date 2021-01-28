import React, { useState } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [nameReg, setNameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [loginStatus, setLoginStatus] = useState('');

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
      
      if (res.data.message) {
        setLoginStatus(res.data.message);
      } else {
        setLoginStatus(res.data[0].name);
      }
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
          type="password" 
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
          type="password" 
          placeholder="Password..." 
          value={password}
          onChange={e => {setPassword(e.target.value)}} 
        />
        <button onClick={login}>Login</button>
      </div>

      <h1>{loginStatus}</h1>
    </div>
  );
}

export default App;
