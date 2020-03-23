import React, { Component, useEffect, useState } from 'react'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { userFetchData, userFetchHasErrored } from '../actions/usersActions';

import CircularProgress from '@material-ui/core/CircularProgress';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';

const LoginPage = (props) => {
    const [loginHasBeenAttempted, setLoginHasBeenAttempted] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');

    useEffect(() => {
        props.userFetchHasErrored(false);
    }, []);

      const handleUserNameChange = (e) => { setUserName(e.target.value) }
      const handleUserPasswordChange = (e) => { setUserPassword(e.target.value) }

      const login = () => {
        props.fetchData(userName, userPassword);
        setLoginHasBeenAttempted(true);
    }

    if (loginHasBeenAttempted && !props.loginHasErrored && !props.isLoading) {
        return <Redirect to={'/'} />;
    }
    /*
    return (
        <div className="container">
            <h1>Login Page</h1>
            <div>
                <input
                    type='text'
                    placeholder='Name'
                    onChange={event => setUserName(event.target.value)} />
                <input
                    type='password'
                    placeholder='Password'
                    onChange={event => setPassword(event.target.value)} />
                <button onClick={login}>Login</button>      
                <div>
                    {props.loginHasErrored && <div><br /><p>Wrong username or password</p></div>}
                </div>
            </div>
        </div>
    );
    */
   return (
    <Box className="addItemBox">
    <Typography variant="h2">Edit user</Typography>
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

<FormGroup row={true}>
                <Button
                  type="button"
                  color="primary"
                  variant="outlined"
                  onClick={login}
                  startIcon={<UpdateIcon />}
                >
                    Login
                </Button>
                <div>
                    {props.loginHasErrored && <div><br /><p>Wrong username or password</p></div>}
                </div>
              </FormGroup>
            </form>
          </Box>

   );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        loginHasErrored: state.userLoginHasErrored,
        isLoading: state.userIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (userName, password) => dispatch(userFetchData(userName, password)),
        userFetchHasErrored: (loginHasErrored) => dispatch(userFetchHasErrored(loginHasErrored))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
