import React, { Component, useEffect, useState } from 'react'

import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from 'react-select';
import * as Yup from 'yup';
import { userDelete, userModify } from '../../actions/usersActions';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';

const UserPageForAdmin = (props) => {
  const [userRole, setUserRole] = useState('');
  const [userEditWasSuccessful, setUserEditWasSuccessful] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userWasDeleted, setUserWasDeleted] = useState(false);

  useEffect(() => {
    if (props.user) {
      setUserName(props.user.name);
    }
    setUserRole(getDefaultSelectRole);
  }, []);

  const getRoleSelectionOptions = [
      { value: 1, label: 'Admin' },
      { value: 2, label: 'Shopkeeper' },
      { value: 3, label: 'Customer' },
  ];

  const getDefaultSelectRole = (
      props.user ?
          getRoleSelectionOptions.filter(option => option.value === parseInt(props.user.role, 10))[0]
          :
          '');

  const handleUserNameChange = (e) => { setUserName(e.target.value) }
  const handleUserPasswordChange = (e) => { setUserPassword(e.target.value) }

  const renderRoleSelection = () => {
    return (
      <div className='userRoleSelection'>
        <Select
          className='userRoleSelection'
          value={userRole}
          onChange={role => setUserRole(role)}
          options={getRoleSelectionOptions}
        />
      </div>
    );
  }

  const deleteUser = () => {
    props.delete(props.user);
    setUserWasDeleted(true);
  }

  const setNewValuesToUser = () => {
    const modifiedUser = {
      id: props.user.id,
      name: userName,
      password: userPassword,
      token: props.user.token,
      role: userRole.value,
    }
    props.modify(modifiedUser);
    setUserRole(userRole);
    setUserEditWasSuccessful(true);
  }

  return (
    props.isLoading
      ?
      <CircularProgress color="secondary" />
      :
      <Box className="addItemBox">
            <Typography variant="h2">Edit user</Typography>
            <form className="addItemBox">
                <TextField
                    label='Name'
                    type='text'
                    name='name'
                    minLength={1}
                    maxLength={10}
                    required
                    value={userName}
                    onChange={handleUserNameChange}
                    on
                />
                <TextField
                    label='Password'
                    type='password'
                    placeholder='*********'
                    name='password'
                    minLength={1}
                    maxLength={10}
                    required
                    value={userPassword}
                    onChange={handleUserPasswordChange}
                    on
                />
                {renderRoleSelection()}
                <FormGroup row={true}>
                    <Button
                    type="button"
                    color="primary"
                    variant="outlined"
                    onClick={setNewValuesToUser}
                    startIcon={<UpdateIcon />}
                    >
                        Modiffy
                    </Button>
<br/>
                    <Button
                  type="button"
                  color="primary"
                  variant="outlined"
                  onClick={deleteUser}
                >
                  Delete
                </Button>
                    <div>
                        {props.loginHasErrored && <div><br /><p>Wrong username or password</p></div>}
                    </div>
                </FormGroup>
            </form>
        </Box>
      /*
      <>
        <Box className="addItemBox">
            <Typography variant="h2">Edit user</Typography>
            <form className="addItemBox">
              {renderTextInputField('name', 'Name')}
              {renderPasswordInputField('password', 'Password')}
              {renderRoleSelection()}
              <br />
              <Button
                type="button"
                color="primary"
                variant="outlined"
                type="submit"
                className="submitButton"
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
      */
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
    delete: (user) => dispatch(userDelete(user)),
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
