import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';

const Header = (props) => {
    const loggedInUserPanel = (userId, userName) => {
        return(
            <div>You are logged in as {userName}</div>
        );
    }
console.log("phead rops.user");
console.log(props.user);
    return (
            <div className='Header'>
                {(props.user ? props.user.auth : false) && loggedInUserPanel(props.user.userId, props.user.userName)}
                <br />
                <Image src={require('./smile.PNG')} rounded />
                <br />
                <Link to={'/'}>
                    <i>home</i>
                </Link>
                <br />
                <Link to={'/login'}>
                    <i>login</i>
                </Link>
                <br />
                <Link to={'/register'}>
                    <i>register</i>
                </Link>
            </div>
        );
    }

    const mapStateToProps = (state) => {
        return {
            user: state.user,
            loginHasErrored: state.loginHasErrored,
            isLoading: state.userIsLoading
        };
    };
    
    export default connect(mapStateToProps)(Header)