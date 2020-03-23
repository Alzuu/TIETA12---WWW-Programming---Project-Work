import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userModify } from '../../actions/usersActions';
import UserPageForAdmin from './UserPageForAdmin';
import UserPageForShopkeeper from './UserPageForShopkeeper';
import UserPageForCustomer from './UserPageForCustomer';

const UserPage = (props) => {
  const userRoleAsNumber = props.user ? parseInt(props.user.role, 10) : '';

  if (props.user) {
    return (
      <>
        {userRoleAsNumber === 1 && <UserPageForAdmin />}
        {userRoleAsNumber === 2 && <UserPageForShopkeeper />}
        {userRoleAsNumber === 3 && <UserPageForCustomer />}
      </>
    );
  } else {
    return (
      <>
        <h1>User deleted succesfully</h1>
        <br />
        <Link to={'/'}>Home</Link>
        <br />
        <Link to={'/register'}>Register</Link>
      </>
    );
  }
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
    modify: (user) => dispatch(userModify(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
