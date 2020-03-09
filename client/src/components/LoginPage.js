import React, { Component, useState } from 'react'
import { connect } from 'react-redux';
import { userFetchData } from '../actions/users';

const LoginPage = (props) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {   props.fetchData(userName, password) }
    
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
                    {props.hasErrored && <div><br /><p>Wrong username or password</p></div>}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        hasErrored: state.userHasErrored,
        isLoading: state.userIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (userName, password) => dispatch(userFetchData(userName, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
