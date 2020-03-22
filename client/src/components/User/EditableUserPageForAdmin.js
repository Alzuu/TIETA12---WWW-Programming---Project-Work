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
  const [selectedRole, setSelectedRole] = useState('');
  const [editableUser, setEditableUser] = useState(undefined);
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

  const getInitialValuesForForm = () => {
    console.log("getInitialValuesForForm o/");
    console.log(editableUser);
    if (editableUser) {
      return ({
        name: editableUser.name,
        role: editableUser.role,
      });
    } else {
      return ({
        name: '',
        password: '',
        role: '',
      });
    }
  }

  const getValidationSchema = () => (
    Yup.object().shape({
      name: Yup.string()
        .min(3, 'Title must be at least 3 characters long.')
        .required('Title is required.'),
    })
  );
  
  const getUser = () => {
    console.log("admin editable getUser o/");
    fetch(`/api/users/${props.match.params.id}`,  { headers: { token: props.adminUser.token } })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
        console.log(json);
        setEditableUser(json);
        setUserName(json.name);
        setSelectedRole(getDefaultSelectRole);
        // setUsers(json);
    })
  }

  function handleUserNameChange(e) {
    setUserName(e.target.value);
  }

  const deleteUser = () => {
    console.log("EditableUserPageForAdmin.js deleteUser o/");
    props.delete(editableUser);
  }

  const handleUserEditSubmit = (user) => {
    console.log("handleUserEditjhgSubmit o/");
    console.log(user);
    const modifiedUser = {
      id: editableUser._id,
      token: props.adminUser.token,
      name: userName,
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

  const renderTextInputField = (fieldName, fieldLabel) => (
    <Field
      type="text"
      name={fieldName}
      label={fieldLabel}
      component={TextInput}
    />
  );

  console.log("AdminUserPage.js editableUser: o/");
  console.log(editableUser);

  if (editableUser) {
    return (
      <>
                  <form className="creditCardBox">
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
