import React, { Component, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';
import { userAdd } from '../actions/usersActions';

const RegistrationPage = (props) => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [registrationHasBeenAttempted, setRegistrationHasBeenAttempted] = useState(false);
  const loginText = ' log in';
  
  const handleUserNameChange = (e) => { setUserName(e.target.value) }
  const handleUserPasswordChange = (e) => { setUserPassword(e.target.value) }
  const handleUserRoleChange = (e) => { setUserRole(e.target.value) }

  const register = () => {
    props.register({
      name: userName,
      password: userPassword,
      role: userRole,
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
    <Box className="addItemBox">
        <Typography variant="h2">Register</Typography>
        <form className="addItemBox">
            <TextField
                label='Name'
                type='text'
                name='name'
                minLength={1}
                maxLength={10}
                required
                value={userName}
                onChange={handleUserNameChange}
                on
            />
            <TextField
                label='Password'
                type='password'
                name='password'
                minLength={1}
                maxLength={10}
                required
                value={userPassword}
                onChange={handleUserPasswordChange}
                on
            />
            <TextField
                label='Role'
                type='text'
                name='role'
                minLength={1}
                maxLength={1}
                required
                value={userRole}
                onChange={handleUserRoleChange}
                on
            />
            <FormGroup row={true}>
                <Button
                type="button"
                color="primary"
                variant="outlined"
                onClick={register}
                startIcon={<UpdateIcon />}
                >
                    Register
                </Button>
            </FormGroup>
        </form>
    </Box>
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