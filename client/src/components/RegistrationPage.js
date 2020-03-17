import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userAdd } from '../actions/usersActions';

const RegistrationPage = (props) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [registrationHasBeenAttempted, setRegistrationHasBeenAttempted] = useState(false);
  const loginText = ' log in';

  const register = () => {
    props.register({
      name,
      password,
      role,
    });

    setRegistrationHasBeenAttempted(true); 
  };

  if (registrationHasBeenAttempted && !props.loginHasErrored) {
    return (
      <p>
        Thanks for registration, you can now 
        <Link to={'/login'}>{loginText}</Link>
      </p>
    );
  }

  return (
    <div className="container">
      <h1>Registration Page</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          onChange={(event) => setRole(event.target.value)}
        />
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
      user: state.user,
      loginHasErrored: state.userLoginHasErrored,
      isLoading: state.userIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      register: (user) => dispatch(userAdd(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage)