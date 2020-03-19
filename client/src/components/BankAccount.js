import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchBankAccount,
  addBankAccount,
  deleteBankAccount,
  updateBankAccount,
  clearBankAccount,
} from '../actions/bankAccounts';
import './bankaccounts.css';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import FormGroup from '@material-ui/core/FormGroup';

function BankAccount(props) {
  const [savedBankAccount, setSavedBankAccount] = useState({});
  const [number, setNumber] = useState(null);
  const [balance, setBalance] = useState(null);
  const [edited, setEdited] = useState(false);
  const [redirect, setRedirect] = useState(null);

  function handleAddSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const bankAccount = {
        number,
        balance,
      };
      props.addBankAccount(bankAccount, props.token, {
        userId: props.userId,
        creditCardId: props.creditCardId,
        userName: props.userName,
        userRole: props.userRole,
      });
    }
  }

  function handleUpdateSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const bankAccount = {
        number,
        balance,
      };
      props.updateBankAccount(props.id, bankAccount, props.token);
      setSavedBankAccount({
        number,
        balance,
      });
      setEdited(false);
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  function handleBalanceChange(e) {
    setBalance(e.target.value);
  }

  function handleDelete(e) {
    setNumber('');
    setBalance(0);
    props.deleteBankAccount(props.id, props.token, {
      userId: props.userId,
      creditCardId: props.creditCardId,
      userName: props.userName,
      userRole: props.userRole,
    });
    setSavedBankAccount({});
    setEdited(false);
    if (props.admin === true) {
      setRedirect('/bankaccounts');
    }
  }

  useEffect(() => {
    props.clearBankAccount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setNumber('');
    setBalance(0);
    props.clearBankAccount();
    if (props.id && props.id !== 'undefined') {
      props.fetchBankAccount(props.id, props.token);
    }
  }, [props.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      props.id &&
      props.bankAccount &&
      props.bankAccount.number !== undefined
    ) {
      setNumber(props.bankAccount.number);
      setBalance(props.bankAccount.balance);
      setSavedBankAccount({
        number: props.bankAccount.number,
        balance: props.bankAccount.balance,
      });
    }
  }, [props.bankAccount]);
  useEffect(() => {
    if (
      props.bankAccountId &&
      props.bankAccountId !== '' &&
      props.bankAccountId !== 'undefined'
    ) {
      setNumber(null);
      setBalance(null);
      props.clearBankAccount();
    }
  }, [props.bankAccountId]);

  useEffect(() => {
    if (
      number !== savedBankAccount.number ||
      balance !== savedBankAccount.balance
    ) {
      setEdited(true);
    } else {
      setEdited(false);
    }
    if (number === undefined) {
      setNumber('');
      setSavedBankAccount({
        number: '',
        balance: 0,
      });
    }
    if (balance === undefined) {
      setBalance(0);
      setSavedBankAccount({
        number: '',
        balance: 0,
      });
    }
  }, [number, balance]); // eslint-disable-line react-hooks/exhaustive-deps

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  if (!props.userId) {
    return (
      <Box className="bankAccountBox">
        <Alert className="warningbox" severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Please login to view bank account.
        </Alert>
      </Box>
    );
  } else {
    if (
      props.bankAccount.id !== undefined &&
      props.id !== null &&
      props.id !== undefined
    ) {
      if (
        (props.id === props.bankAccountId &&
          props.bankAccountId !== undefined) ||
        (props.userRole === 1 && props.admin === true)
      ) {
        return (
          <Box className="bankAccountBox">
            <Typography variant="h2">Edit bank account</Typography>
            {edited ? (
              <Alert severity="info">Press 'Update' to save changes.</Alert>
            ) : (
              ''
            )}
            <form onSubmit={handleUpdateSubmit} className="bankAccountBox">
              <TextField
                label="Bank account number"
                type="text"
                name="number"
                minLength="1"
                maxLength="20"
                required
                value={number}
                onChange={handleNumberChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Bank account balance"
                type="number"
                name="balance"
                min="0"
                required
                value={balance}
                onChange={handleBalanceChange}
                InputLabelProps={{ shrink: true }}
              />
              <FormGroup row={true}>
                <Button
                  type="submit"
                  color="primary"
                  variant="outlined"
                  startIcon={<UpdateIcon />}
                >
                  Update
                </Button>
                <Button
                  type="button"
                  startIcon={<DeleteIcon />}
                  color="secondary"
                  variant="outlined"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </FormGroup>
            </form>
          </Box>
        );
      }
    } else {
      if (props.id === props.bankAccountId) {
        return (
          <Box className="bankAccountBox">
            <Typography variant="h2">Add bank account</Typography>
            {props.bankAccount && props.bankAccount.message ? (
              <Alert severity="error" className="warningBox">
                Adding bank account failed! Are you sure the number is correct?
              </Alert>
            ) : (
              ''
            )}
            <form onSubmit={handleAddSubmit} className="bankAccountBox">
              <TextField
                label="Bank account number"
                type="text"
                name="number"
                minLength="1"
                maxLength="20"
                required
                value={number}
                onChange={handleNumberChange}
              />
              <TextField
                label="Bank account balance"
                type="number"
                name="balance"
                required
                value={balance}
                onChange={handleBalanceChange}
              />
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add bank account
              </Button>
            </form>
          </Box>
        );
      } else {
        if (props.userRole === 1) {
          return (
            <Box className="bankAccountBox">
              <Typography variant="h2">Edit bank account</Typography>
              {edited ? (
                <Alert severity="info">Press 'Update' to save changes.</Alert>
              ) : (
                ''
              )}
              <form onSubmit={handleUpdateSubmit} className="bankAccountBox">
                <TextField
                  label="Bank account number"
                  type="text"
                  name="number"
                  minLength="1"
                  maxLength="20"
                  required
                  value={number}
                  onChange={handleNumberChange}
                />
                <TextField
                  label="Bank account balance"
                  type="number"
                  name="balance"
                  required
                  value={balance}
                  onChange={handleBalanceChange}
                />
                <FormGroup row={true}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="outlined"
                    startIcon={<UpdateIcon />}
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    startIcon={<DeleteIcon />}
                    color="secondary"
                    variant="outlined"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </FormGroup>
              </form>
            </Box>
          );
        }
      }
    }
  }
}

const mapStateToProps = (state) => ({
  bankAccount: state.bankAccountsReducer,
  bankAccountId: state.user.bankAccountId,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
  userName: state.user.name,
  creditCardId: state.user.creditCardId,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBankAccount: (id, token) => dispatch(fetchBankAccount(id, token)),
    addBankAccount: (details, token, user) =>
      dispatch(addBankAccount(details, token, user)),
    deleteBankAccount: (id, token, user) =>
      dispatch(deleteBankAccount(id, token, user)),
    updateBankAccount: (id, details, token) =>
      dispatch(updateBankAccount(id, details, token)),
    clearBankAccount: () => dispatch(clearBankAccount()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BankAccount);
