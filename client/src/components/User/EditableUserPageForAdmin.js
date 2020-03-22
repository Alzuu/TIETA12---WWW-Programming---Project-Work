import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import UpdateIcon from '@material-ui/icons/Update';

const EditableUserPageForAdmin = (props) => {
  const [userCreditCardId, setUserCreditCardId] = useState('');
  const [editableUser, setEditableUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [userBankAccountId, setUserBankAccountId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
      getUser();
    }, []);

  const getRoleSelectionOptions = [
      { value: 1, label: 'Admin' },
      { value: 2, label: 'Shopkeeper' },
      { value: 3, label: 'Customer' },
  ];

  const getDefaultSelectRole = (
      editableUser ?
          getRoleSelectionOptions.filter(option => option.value === parseInt(editableUser.role, 10))[0]
          :
          '');

  const getUser = () => {
    fetch(`/api/users/${props.match.params.id}`,  { headers: { token: props.adminUser.token } })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
          setUserBankAccountId(json.bankAccountId);
          setUserCreditCardId(json.creditCardId);
          setEditableUser(json);
          setUserName(json.name);
          setUserRole(json.role);
      })
  }

  const handleUserBankAccountIdChange = (e) => { setUserBankAccountId(e.target.value) }
  const handleUserCreditCardIdChange = (e) => { setUserCreditCardId(e.target.value) }
  const handleUserNameChange = (e) => { setUserName(e.target.value) }
  const handleUserPasswordChange = (e) => { setUserPassword(e.target.value) }
  const handleUserRoleChange = (e) => { setUserRole(e.target.value) }
  
  const deleteUser = () => {
    setIsLoading(true);
    fetch(`/api/users/${editableUser._id}`, {
      method: 'DELETE',
      headers: {
        token: props.adminUser.token,
      },
    })
    .then((res) => res.json())
      .then((json) => {
        setIsLoading(false);
      });
  }

  const handleUserEditSubmit = (user) => {
    setIsLoading(true);
    const modifiedUser = {
      bankAccountId: userBankAccountId,
      creditCardId: userCreditCardId,
      id: editableUser._id,
      token: props.adminUser.token,
      name: userName,
      password: userPassword,
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
        setIsLoading(false);
      });  
  }

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
      isLoading
        ?
        <CircularProgress color="secondary" />
        :
        <>
          <form>
            {renderTextField('userBankAccountId', 'Bank Account ID',
                            handleUserBankAccountIdChange, 1, 8,
                            userBankAccountId)}
            {renderTextField('userCreditCardId', 'Credit Card ID',
                            handleUserCreditCardIdChange, 1, 8,
                            userCreditCardId)}
            {renderTextField('name', 'Name',
                            handleUserNameChange, 1, 20,
                            userName)}
            <TextField
              label='Password'
              type='password'
              placeholder="***"
              name='password'
              minLength={1}
              maxLength={10}
              required
              value={userPassword}
              onChange={handleUserPasswordChange}
              on
            />
            {renderTextField('role', 'Role',
                            handleUserRoleChange, 1, 1,
                            userRole)}
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
              <br />
              <Button
                type="button"
                color="primary"
                variant="outlined"
                onClick={deleteUser}
              >
                Delete
              </Button>
            </FormGroup>
          </form>
        </>
    )
  
  }

  return <></>;
}

const mapStateToProps = (state) => {
  return {
      adminUser: state.user,
  };
};

export default connect(mapStateToProps)(EditableUserPageForAdmin)
