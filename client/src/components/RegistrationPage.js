import React, { Component, useState } from 'react';

const RegistrationPage = (props) => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    fetch('api/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userName,
        role: userRole,
        password: password,
        creditCardId: '123',
        bankAccountId: '456',
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <h1>Registration Page</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          onChange={(event) => setUserName(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          onChange={(event) => setUserRole(event.target.value)}
        />
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
};

export default RegistrationPage;
