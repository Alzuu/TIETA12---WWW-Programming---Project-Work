import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreditCard from '../CreditCard';
import BankAccount from '../BankAccount';
import { userDelete, userModify } from '../../actions/usersActions';
import TextInput from './TextInputFormik';
 
const UserPageForCustomer = (props) => {
  const getInitialValuesForForm = () => (
    props.user ? 
      {
        name: props.user.name,
      }
      :
      {
        name: '',
      }
  );

  const getValidationSchema = () => (
    Yup.object().shape({
      name: Yup.string()
        .min(3, 'Title must be at least 3 characters long.')
        .required('Title is required.'),
    })
  );

  const deleteUser = () => {
    console.log("UserPageForAdmin.js deleteUser o/");
    props.delete(props.user);
  }

  const setNewValuesToUser = (user) => {
    const modifiedUser = {
      ...user,
      id: props.user.id,
      token: props.user.token,
      role: props.user.role,
    }
    props.modify(modifiedUser);
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

  return (
    props.isLoading
      ?
      <CircularProgress color="secondary" />
      :
      <>
        <Formik
          validationSchema={getValidationSchema}
          initialValues={getInitialValuesForForm()}
          onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              setNewValuesToUser(values);
          }}
          render={({ values, errors, isSubmitting }) => (
            <Form>
              {renderTextInputField('name', 'Name')}
              {renderPasswordInputField('password', 'Password')}
              <br />
              <button
                type="submit"
                className="submitButton"
              >
                Save
              </button>
            </Form>
          )}
        />
        <br />
        <Button
          type="button"
          onClick={deleteUser}
        >
          Delete user
        </Button>
        
        <CreditCard id={props.user.creditCardId} />
        <BankAccount id={props.user.bankAccountId} />
      </>
  )
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
    delete: (user) => dispatch(userDelete(user)),
    modify: (user) => dispatch(userModify(user)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(UserPageForCustomer)
