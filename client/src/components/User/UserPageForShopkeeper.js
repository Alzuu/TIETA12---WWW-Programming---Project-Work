import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import isEmpty from 'lodash/isEmpty'
import * as Yup from 'yup';
import { userDelete, userModify } from '../../actions/usersActions';
import TextInput from './TextInputFormik';
 
const UserPageForShopkeeper = (props) => {
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
              <Button
                type="submit"
                color="primary"
                variant="outlined"
                disabled={isSubmitting || !isEmpty(errors)}
              >
                Save
              </Button>
            </Form>
          )}
        />
        <br />
        <Button
          type="button"
          color="primary"
          variant="outlined"
          onClick={deleteUser}
        >
          Delete user
        </Button>
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


export default connect(mapStateToProps, mapDispatchToProps)(UserPageForShopkeeper)
