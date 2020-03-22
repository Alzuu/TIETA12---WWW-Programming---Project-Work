import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import { userModify } from '../../actions/usersActions';

const UserList = (props) => {
    //const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        //setSelectedRole();
      }, []);

/*    const setNewValuesToUser = (user) => {
    const modifiedUser = {
      ...user,
      id: props.user.id,
      token: props.user.token,
      role: selectedRole.value,
    }
    props.modify(modifiedUser);
    setSelectedRole(selectedRole);
    }*/
    console.log("UserList.js props.user: o/");
    return (
        <>
            <h1>User List</h1>
        </>
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
    modify: (user) => dispatch(userModify(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
