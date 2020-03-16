import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';

const Header = (props) => {
  const userHasLoggedIn = () => (props.user ? props.user.auth : false);
  const userIsAdmin = () => props.user.userRole === 1;
  const userIsShopkeeper = () => props.user.userRole === 2;

  const renderLink = (linkPath, linkText) => (
    <>
      <Link to={linkPath}>
        <i>{linkText}</i>
      </Link>
      <br />
    </>
  );

  const renderHeaderForLoggedInUserInfoPanel = (userId, userName) => (
    <>
      <div>You are logged in as {userName}</div>
      {renderLink(`/users/${userId}`, 'edit user information')}
      {renderLink('/logout', 'logout')}
    </>
  );

  const renderHeaderForLoggedInUser = () => (
    <div className="Header">
      {(props.user ? props.user.auth : false) &&
        renderHeaderForLoggedInUserInfoPanel(
          props.user.userId,
          props.user.userName
        )}
      <br />
      <Image src={require('./smile.PNG')} rounded />
      <br />
      {renderLink('/', 'home')}
      {userIsAdmin() && renderLink('/items', 'list all items')}
      {(userIsAdmin() || userIsShopkeeper()) &&
        renderLink('/items/customers', 'list customer items')}
      {renderLink(`/users/${props.user.userId}/items`, 'list own items')}
      {props.user.userRole && renderLink('/items/add', 'add new item')}
      {userIsAdmin() && renderLink('/creditcards', 'list all credit cards')}
    </div>
  );

  const renderHeaderForNonLoggedInUser = (user) => (
    <div className="Header">
      <Image src={require('./smile.PNG')} rounded />
      <br />
      {renderLink('/', 'home')}
      {renderLink('/login', 'login')}
      {renderLink('/register', 'register')}
    </div>
  );

  return props.user
    ? renderHeaderForLoggedInUser()
    : renderHeaderForNonLoggedInUser();
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginHasErrored: state.loginHasErrored,
    isLoading: state.userIsLoading,
  };
};

export default connect(mapStateToProps)(Header);
