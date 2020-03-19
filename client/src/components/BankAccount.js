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
  }, []);

  useEffect(() => {
    setNumber(null);
    setBalance(null);
    if (props.id) {
      props.fetchBankAccount(props.id, props.token);
    }
  }, [props.id]);

  useEffect(() => {
    if (props.bankAccount) {
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
      number !== savedBankAccount.number ||
      balance !== savedBankAccount.balance
    ) {
      setEdited(true);
    } else {
      setEdited(false);
    }
    if (number === undefined) {
      setNumber(null);
      setSavedBankAccount({ number: null, balance: null });
    }
    if (balance === undefined) {
      setBalance(null);
      setSavedBankAccount({ number: null, balance: null });
    }
  }, [number, balance]);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  if (!props.userId) {
    return <h2>Please login to view bank account.</h2>;
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
          <div>
            <h2>Edit bank account</h2>
            {edited ? <p>Press 'Update' to save changes.</p> : ''}
            <form onSubmit={handleUpdateSubmit}>
              <label>
                Bank account number:
                <input
                  type="text"
                  name="number"
                  minLength="1"
                  maxLength="20"
                  required
                  value={number}
                  onChange={handleNumberChange}
                />
              </label>
              <label>
                Bank account balance:
                <input
                  type="number"
                  name="balance"
                  required
                  value={balance}
                  onChange={handleBalanceChange}
                />
              </label>
              <br />
              <button type="submit">Update</button>
              <button type="button" onClick={handleDelete}>
                Delete
              </button>
            </form>
          </div>
        );
      }
    } else {
      if (props.id === props.bankAccountId) {
        return (
          <div>
            <h2>Add bank account</h2>
            {props.bankAccount && props.bankAccount.message ? (
              <p>
                Adding bank account failed! Are you sure the number is correct?
              </p>
            ) : (
              ''
            )}
            <form onSubmit={handleAddSubmit}>
              <label>
                Bank account number:
                <input
                  type="text"
                  name="number"
                  minLength="1"
                  maxLength="20"
                  required
                  value={number}
                  onChange={handleNumberChange}
                />
              </label>
              <br />
              <label>
                Bank account balance:
                <input
                  type="number"
                  name="balance"
                  required
                  value={balance}
                  onChange={handleBalanceChange}
                />
              </label>
              <br />
              <button type="submit">Add bank account</button>
            </form>
          </div>
        );
      } else {
        if (props.userRole === 1) {
          return (
            <div>
              <h2>Edit bank account</h2>
              {edited ? <p>Press 'Update' to save changes.</p> : ''}
              <form onSubmit={handleUpdateSubmit}>
                <label>
                  Bank account number:
                  <input
                    type="text"
                    name="number"
                    minLength="1"
                    maxLength="20"
                    required
                    value={number}
                    onChange={handleNumberChange}
                  />
                </label>
                <br />
                <label>
                  Bank account balance:
                  <input
                    type="number"
                    name="balance"
                    required
                    value={balance}
                    onChange={handleBalanceChange}
                  />
                </label>
                <br />
                <button type="submit">Update</button>
                <button type="button" onClick={handleDelete}>
                  Delete
                </button>
              </form>
            </div>
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
