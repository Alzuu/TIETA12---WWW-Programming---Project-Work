import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { userLogout } from '../actions/usersActions';

const LogoutPage = (props) => {
    useEffect(() => {
        props.logout();
      }, []);

    return (
        <div className="container">
            <h1>Logout Page</h1>
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
        logout: () => dispatch(userLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage)
