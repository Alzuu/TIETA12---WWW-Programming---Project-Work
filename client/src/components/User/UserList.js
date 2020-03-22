import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import { userModify } from '../../actions/usersActions';

const UserList = (props) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("UserList.js useEffect o/");
        getUsers();
    }, []);

    const getUsers = () => (
        fetch('/api/users',  { headers: { token: props.user.token } })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                setUsers(json);
            })
    );

    console.log("UserList.js o/");

    return (
        <>
            <h1>User List</h1>
            {users.map((user) => 
                (
                    <div>
                        {user.name}
                    </div>
                )
            )}
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
