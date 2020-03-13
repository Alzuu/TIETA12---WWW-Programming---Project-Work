import React, { Component, useState } from 'react';
import { connect } from 'react-redux';

const UserPage = (props) => {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    const editUser = () => {
      /*
        fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                role: userRole,
                password: password,
                creditCardId: '123',
                bankAccountId: '456',
            })
          }).then(response => {
            console.log(response)
        })
        .catch(error =>{
            console.log(error)
        })
        */
    }

    console.log("UserPsge!");
    console.log(props.user.userName);
    
    return (
        <div className="container">
            <h1>User Page</h1>
            <div>
                <input
                    type='text'
                    placeholder={props.user.userName}
                    onChange={event => setUserName(event.target.value)} />
                <input
                    type='text'
                    placeholder='Role'
                    onChange={event => setUserRole(event.target.value)} />
                <button onClick={editUser}>Edit</button>                     
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
  return {
      user: state.user,
  };
};
/*
const mapDispatchToProps = (dispatch) => {
  return {
      fetchData: (userName, password) => dispatch(userFetchData(userName, password)),
      userloginHasErrored: (loginHasErrored) => dispatch(userloginHasErrored(loginHasErrored))
  };
};
*/
export default connect(mapStateToProps)(UserPage)
