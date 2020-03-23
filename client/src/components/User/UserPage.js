import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik'
import isEmpty from 'lodash/isEmpty'
import Select from 'react-select';
import * as Yup from 'yup';
import {Link} from 'react-router-dom'
import CreditCard from '../CreditCard';
import BankAccount from '../BankAccount';
import { userModify } from '../../actions/usersActions';
import TextInput from './TextInputFormik';
import UserRole from './UserRole';
import UserPageForAdmin from './UserPageForAdmin';
import UserPageForShopkeeper from './UserPageForShopkeeper';
import UserPageForCustomer from './UserPageForCustomer';
 
const UserPage = (props) => {
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        setSelectedRole(getDefaultSelectRole);
      }, []);

    const getRoleSelectionOptions = [
        { value: 0, label: 'Admin' },
        { value: 1, label: 'Shopkeeper' },
        { value: 2, label: 'Customer' },
    ];

    const getDefaultSelectRole = (
        props.user ?
            getRoleSelectionOptions.filter(option => option.value === parseInt(props.user.role, 10))[0]
            :
            '');

  const getInitialValuesForForm = () => (
    props.user ? 
      {
        name: props.user.name,
        role: props.user.role,
      }
      :
      {
        name: '',
        role: '',
      }
  );

  const getValidationSchema = () => (
    Yup.object().shape({
      name: Yup.string()
        .min(3, 'Title must be at least 3 characters long.')
        .required('Title is required.'),
    })
  )

  const setNewValuesToUser = (user) => {
    const modifiedUser = {
      ...user,
      id: props.user.id,
      token: props.user.token,
      role: selectedRole.value,
    }
    props.modify(modifiedUser);
    setSelectedRole(selectedRole);
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

  const renderTextInputField = (fieldName, fieldLabel) => (
    <Field
      type="text"
      name={fieldName}
      label={fieldLabel}
      component={TextInput}
    />
  );

  const userRoleAsNumber = props.user ? parseInt(props.user.role, 10) : '';

  console.log("UserPage.js props.user: o/");
  console.log(props.user);
  console.log(userRoleAsNumber);

  if (props.user) {
    return (
      <>
        {(userRoleAsNumber === 0) && <UserPageForAdmin />}
        {(userRoleAsNumber === 1) && <UserPageForShopkeeper />}
        {(userRoleAsNumber === 2) && <UserPageForCustomer />}
      </>
    )  
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


export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
