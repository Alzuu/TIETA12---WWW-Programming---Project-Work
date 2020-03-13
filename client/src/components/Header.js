import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';

const Header = (props) => {
  const loggedInUserPanel = (userId, userName) => {
    return (
      <>
        <div>You are logged in as {userName}</div>
        <Link to={`/users/${userId}`}>
          <i>edit user information</i>
        </Link>
        <Link to={`/logout`}>
          <i>logout</i>
        </Link>
      </>
    );
  };
  console.log('phead rops.user');
  console.log(props.user);
  return (
    <div className="Header">
      {(props.user ? props.user.auth : false) &&
        loggedInUserPanel(props.user.userId, props.user.userName)}
      <br />
      <Image src={require('./smile.PNG')} rounded />
      <br />
      <Link to={'/'}>
        <i>home</i>
      </Link>
      <br />
      {props.user.userRole === 1 ? (
        <Link to={'/items'}>
          list all items
          <br />
        </Link>
      ) : (
        ''
      )}
      {props.user.userRole === 1 || props.user.userRole === 2 ? (
        <Link to={'/items/customers'}>
          list customer items
          <br />
        </Link>
      ) : (
        ''
      )}
      {props.user.userId ? (
        <Link to={`/users/${props.user.userId}/items`}>
          list own items
          <br />
        </Link>
      ) : (
        ''
      )}
      {props.user.userRole ? (
        <Link to={'/items/add'}>
          add new item
          <br />
        </Link>
      ) : (
        ''
      )}

      <Link to={'/login'}>
        <i>login</i>
      </Link>
      <br />
      <Link to={'/register'}>
        <i>register</i>
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginHasErrored: state.loginHasErrored,
    isLoading: state.userIsLoading,
  };
};

export default connect(mapStateToProps)(Header);
