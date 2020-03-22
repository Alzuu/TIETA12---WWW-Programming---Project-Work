import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik'
import isEmpty from 'lodash/isEmpty'
import Select from 'react-select';
import * as Yup from 'yup';
import {Link} from 'react-router-dom'
import { userModify } from '../../actions/usersActions';
import TextInput from './TextInputFormik';
import UserRole from './UserRole';
 
const UserPageForAdmin = (props) => {
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
        password: props.user.password,
        role: props.user.role,
      }
      :
      {
        name: '',
        password: '',
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

  return (
    <>
      <Formik
        validationSchema={getValidationSchema}
        initialValues={getInitialValuesForForm()}
        onSubmit={(values, actions) => {
            actions.setSubmitting(false);
            setNewValuesToUser(values);
        }}
        render={({ values, isSubmitting }) => (
          <Form>
            {renderTextInputField('name', 'Name')}
            {renderTextInputField('password', 'Password')}
            {renderRoleSelection()}
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
    modify: (user) => dispatch(userModify(user)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(UserPageForAdmin)
/*
import React, { Component } from 'react'
import { Formik, Field } from 'formik';
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import * as Yup from 'yup';

export default function UserPageForAdmin() {

  const SignupSchema = Yup.object().shape({
    address: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    password: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Required")
  });

  const customInputForm = ({field, form: {touched, errors}, ...props}) => (
    <div>
        <Input
            invalid={!!(touched[field.name] && errors[field.name])}
            {...field}
            {...props} />
        {touched[field.name] && errors[field.name] && <FormFeedback>{errors[field.name]}</FormFeedback>}
    </div>
  );

  return (
    <div className="container">
      <Formik
        initialValues={{
          email: '',
          address: '',
          password: ''
        }}
        validationSchema={SignupSchema}
        onSubmit={(values, actions) => {
          // this could also easily use props or other
          // local state to alter the behavior if needed
          // this.props.sendValuesToServer(values)

          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
        }}>
        <Form>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Field name="email" type={'email'} component={customInputForm}/>
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Field name="address" type={'text'} component={customInputForm}/>
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Field name="password" type={'password'} component={customInputForm}/>
            </FormGroup>
            <Button>Submit</Button>
        </Form>
      </Formik>    
    </div>
  )
}
*/
