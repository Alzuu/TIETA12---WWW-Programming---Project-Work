import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { userLogout } from '../actions/usersActions';
import Typography from '@material-ui/core/Typography';

const LogoutPage = (props) => {
  useEffect(() => {
    props.logout();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
      <Typography variant="h2">You have succesfully logged out</Typography>
    </div>
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
    logout: () => dispatch(userLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);
