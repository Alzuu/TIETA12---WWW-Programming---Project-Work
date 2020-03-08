import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';

const Header = (props) => {
console.log("phead rops.user");
console.log(props.user);
    return (
            <div className='Header'>
                {(props.user) && <div>You are logged in</div>}
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
            hasErrored: state.userHasErrored,
            isLoading: state.userIsLoading
        };
    };
    
    export default connect(mapStateToProps)(Header)