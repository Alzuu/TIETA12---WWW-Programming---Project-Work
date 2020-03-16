import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { userFetchData, userFetchHasErrored } from '../actions/usersActions';

const LoginPage = (props) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        props.userFetchHasErrored(false);
      }, []);

    const login = () => {
        props.fetchData(userName, password)
    }

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
