import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik'
import isEmpty from 'lodash/isEmpty'
import Select from 'react-select';
import * as Yup from 'yup';
import { Link, Redirect } from 'react-router-dom'
import { userDelete, userModify } from '../../actions/usersActions';
import TextInput from './TextInputFormik';
import UserRole from './UserRole';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import UpdateIcon from '@material-ui/icons/Update';

const EditableUserPageForAdmin = (props) => {
  const [userCreditCardId, setUserCreditCardId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [editableUser, setEditableUser] = useState(undefined);
  const [password, setPassword] = useState('');
  const [userBankAccountId, setUserBankAccountId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

    useEffect(() => {
        getUser();
      }, []);

    const getRoleSelectionOptions = [
        { value: 0, label: 'Admin' },
        { value: 1, label: 'Shopkeeper' },
        { value: 2, label: 'Customer' },
    ];

    const getDefaultSelectRole = (
        editableUser ?
            getRoleSelectionOptions.filter(option => option.value === parseInt(editableUser.role, 10))[0]
            :
            '');

  const getUser = () => {
    console.log("admin editable getUser o/");
    fetch(`/api/users/${props.match.params.id}`,  { headers: { token: props.adminUser.token } })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
        console.log(json);
        setUserBankAccountId(json.bankAccountId);
        setUserCreditCardId(json.creditCardId);
        setEditableUser(json);
        setUserName(json.name);
        setUserRole(json.role);
        setSelectedRole(getDefaultSelectRole);
        // setUsers(json);
    })
  }

  const handleUserBankAccountIdChange = (e) => { setUserBankAccountId(e.target.value) }
  const handleUserCreditCardIdChange = (e) => { setUserCreditCardId(e.target.value) }
  const handleUserNameChange = (e) => { setUserName(e.target.value) }
  const handleUserRoleChange = (e) => { setUserRole(e.target.value) }
  
  const deleteUser = () => {
    console.log("EditableUserPageForAdmin.js deleteUser o/");
    props.delete(editableUser);
  }

  const handleUserEditSubmit = (user) => {
    console.log(user);
    const modifiedUser = {
      bankAccountId: userBankAccountId,
      creditCardId: userCreditCardId,
      id: editableUser._id,
      token: props.adminUser.token,
      name: userName,
      role: userRole,
    }
    fetch(`/api/users/${editableUser._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: user.token,
      },
      body: JSON.stringify(modifiedUser),
    })
      .then((res) => res.json())
      .then((user) => {
        console.log("edit!!!");
        console.log(user);
      });  
  }

  const renderRoleSelection = () => {
    return (
      <div className='userRoleSelection'>
        <Select
            className='userRoleSelection'
            value={selectedRole}
            onChange={role => setSelectedRole(role)}
            options={getRoleSelectionOptions}
        />
      </div>
    );
  }

  const renderPasswordInputField = (fieldName, fieldLabel) => (
    <Field
      type="password"
      name={fieldName}
      placeholder={"********"}
      label={fieldLabel}
      component={TextInput}
    />
  );

  const renderTextField = (fieldName, fieldLabel, handlerFunction, maxLength, minLength, val) => (
    <TextField
      label={fieldLabel}
      type="text"
      name={fieldName}
      minLength={minLength}
      maxLength={maxLength}
      required
      value={val}
      onChange={handlerFunction}
      on
    />
  );

  if (editableUser) {
    return (
      <>
        <form className="creditCardBox">
          {renderTextField('userBankAccountId', 'Bank Account ID',
                           handleUserBankAccountIdChange, 1, 8,
                           userBankAccountId)}
          {renderTextField('userCreditCardId', 'Credit Card ID',
                           handleUserCreditCardIdChange, 1, 8,
                           userCreditCardId)}
          <TextField
            label="name"
            type="text"
            name="name"
            minLength="1"
            maxLength="20"
            required
            value={userName}
            onChange={handleUserNameChange}
            on
          />
          <TextField
            label="role"
            type="text"
            name="role"
            minLength="1"
            maxLength="1"
            required
            value={userRole}
            onChange={handleUserRoleChange}
            on
          />
          <FormGroup row={true}>
            <Button
              type="button"
              color="primary"
              variant="outlined"
              onClick={handleUserEditSubmit}
              startIcon={<UpdateIcon />}
            >
              Update
            </Button>
          </FormGroup>
        </form>
      </>
    )
  
  }

  return <></>;
  
/*
  console.log("AdminUserPage.js par o/");
  console.log(props.params);
  console.log(props.match.params.id);
  return (
    <>
      Admin User Page
    </>
  )
  */
}

const mapStateToProps = (state) => {
  return {
      adminUser: state.user,
      loginHasErrored: state.userLoginHasErrored,
      isLoading: state.userIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    delete: (user) => dispatch(userDelete(user)),
    modify: (user) => dispatch(userModify(user)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(EditableUserPageForAdmin)
