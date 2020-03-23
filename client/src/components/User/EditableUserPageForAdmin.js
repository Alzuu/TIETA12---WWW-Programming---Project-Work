import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';
import { Redirect } from 'react-router-dom';

const EditableUserPageForAdmin = (props) => {
  const [editableUser, setEditableUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userBankAccountId, setUserBankAccountId] = useState('');
  const [userCreditCardId, setUserCreditCardId] = useState('');
  const [userEditWasSuccessful, setUserEditWasSuccessful] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [userWasDeleted, setUserWasDeleted] = useState(false);

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getRoleSelectionOptions = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Shopkeeper' },
    { value: 3, label: 'Customer' },
  ];

  const getDefaultSelectRole = (role) =>
    getRoleSelectionOptions.filter(
      (option) => option.value === parseInt(role, 10)
    )[0];

  const getUser = () => {
    fetch(`/api/users/${props.match.params.id}`, {
      headers: { token: props.adminUser.token },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setUserBankAccountId(json.bankAccountId);
        setUserCreditCardId(json.creditCardId);
        setEditableUser(json);
        setUserName(json.name);
        setUserRole(getDefaultSelectRole(json.role));
      });
  };

  const handleUserBankAccountIdChange = (e) => {
    setUserBankAccountId(e.target.value);
  };
  const handleUserCreditCardIdChange = (e) => {
    setUserCreditCardId(e.target.value);
  };
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleUserPasswordChange = (e) => {
    setUserPassword(e.target.value);
  };

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
        setUserWasDeleted(true);
      });
  };

  const handleUserEditSubmit = (user) => {
    setIsLoading(true);
    const modifiedUser = {
      bankAccountId: userBankAccountId,
      creditCardId: userCreditCardId,
      id: editableUser._id,
      token: props.adminUser.token,
      name: userName,
      password: userPassword,
      role: userRole.value,
    };

    fetch(`/api/users/${editableUser._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: props.adminUser.token,
      },
      body: JSON.stringify(modifiedUser),
    })
      .then((res) => res.json())
      .then((user) => {
        setIsLoading(false);
        setUserEditWasSuccessful(true);
      });
  };

  const renderRoleSelection = () => {
    return (
      <div className="userRoleSelection" style={{ width: '150px' }}>
        <Select
          className="userRoleSelection"
          value={userRole}
          onChange={(role) => setUserRole(role)}
          options={getRoleSelectionOptions}
        />
      </div>
    );
  };

  const renderTextField = (
    fieldName,
    fieldLabel,
    handlerFunction,
    maxLength,
    minLength,
    val
  ) => (
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

  if (userWasDeleted) {
    return <Redirect to={'/users'} />;
  }
  if (editableUser) {
    return isLoading ? (
      <CircularProgress color="secondary" />
    ) : (
      <>
        {userEditWasSuccessful && (
          <>
            User edited succesfully
            <br />
          </>
        )}
        <Box className="addItemBox">
          <Typography variant="h2">Edit user</Typography>
          <form className="addItemBox">
            {renderTextField(
              'userBankAccountId',
              'Bank Account ID',
              handleUserBankAccountIdChange,
              1,
              8,
              userBankAccountId
            )}
            {renderTextField(
              'userCreditCardId',
              'Credit Card ID',
              handleUserCreditCardIdChange,
              1,
              8,
              userCreditCardId
            )}
            {renderTextField(
              'name',
              'Name',
              handleUserNameChange,
              1,
              20,
              userName
            )}
            <TextField
              label="Password"
              type="password"
              placeholder="***"
              name="password"
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
        </Box>
      </>
    );
  }

  return <></>;
};

const mapStateToProps = (state) => {
  return {
    adminUser: state.user,
  };
};

export default connect(mapStateToProps)(EditableUserPageForAdmin);
