import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import {Link} from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { userModify } from '../../actions/usersActions';

const UserList = (props) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
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

    return (
        <>
            <h1>User List</h1>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Bank Account ID</TableCell>
                        <TableCell>Credit Card ID</TableCell>
                        <TableCell>Edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {users.map((user) => 
                    <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.bankAccountId}</TableCell>
                        <TableCell>{user.creditCardId}</TableCell>
                        <TableCell>                        
                            <Link to={`/users/adminEdit/${user._id}`}>
                                <IconButton color="primary">
                                    <EditIcon />
                                </IconButton>
                            </Link>
                        </TableCell>
                    </TableRow>
            )}
                </TableBody>

        </Table>
      </TableContainer>
        </>
    );
}
/*
<Link to={}>edit {user.name}</Link>
                    <br />
*/

const mapStateToProps = (state) => {
  return {
      user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modify: (user) => dispatch(userModify(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
