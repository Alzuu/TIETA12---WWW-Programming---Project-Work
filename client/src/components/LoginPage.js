import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';
import { userFetchData, userFetchHasErrored } from '../actions/usersActions';

const LoginPage = (props) => {
  const [loginHasBeenAttempted, setLoginHasBeenAttempted] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    props.userFetchHasErrored(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleUserPasswordChange = (e) => {
    setUserPassword(e.target.value);
  };

  const login = () => {
    props.fetchData(userName, userPassword);
    setLoginHasBeenAttempted(true);
  };

  if (loginHasBeenAttempted && !props.loginHasErrored && !props.isLoading) {
    return <Redirect to={'/'} />;
  }

  return (
    <Box className="addItemBox">
      <Typography variant="h2">Login</Typography>
      <form className="addItemBox">
        <TextField
          label="Name"
          type="text"
          name="name"
          minLength={1}
          maxLength={10}
          required
          value={userName}
          onChange={handleUserNameChange}
          on
        />
        <TextField
          label="Password"
          type="password"
          name="password"
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
            {props.loginHasErrored && (
              <div>
                <br />
                <p>Wrong username or password</p>
              </div>
            )}
          </div>
        </FormGroup>
      </form>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginHasErrored: state.userLoginHasErrored,
    isLoading: state.userIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (userName, password) =>
      dispatch(userFetchData(userName, password)),
    userFetchHasErrored: (loginHasErrored) =>
      dispatch(userFetchHasErrored(loginHasErrored)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
