import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  addCreditCard,
  getCreditCard,
  editCreditCard,
  deleteCreditCard,
  clearCreditCard,
} from '../actions/creditCards';

function CreditCard(props) {
  const [savedCard, setSavedCard] = useState({});
  const [number, setNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [edited, setEdited] = useState(false);
  const [redirect, setRedirect] = useState(null);

  console.log(props);
  function handleAddSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const card = {
        number: number,
        CVC: cvc,
        ownerName: ownerName,
      };
      console.log(props);
      props.addCreditCard(card, props.token, {
        userId: props.userId,
        bankAccountId: props.bankAccountId,
        userName: props.userName,
        userRole: props.userRole,
      });
    }
  }
  function handleEditSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const card = {
        number: number,
        CVC: cvc,
        ownerName: ownerName,
      };
      props.editCreditCard(card, props.token, props.id);
      setSavedCard({ number: number, cvc: cvc, ownerName: ownerName });
      setEdited(false);
    }
  }
  function handleNumberChange(e) {
    setNumber(e.target.value);
  }
  function handleCvcChange(e) {
    setCvc(e.target.value);
  }
  function handleOwnerNameChange(e) {
    setOwnerName(e.target.value);
  }
  function handleDelete(e) {
    setNumber('');
    setCvc('');
    setOwnerName('');
    props.deleteCreditCard(props.id, props.token, {
      userId: props.userId,
      bankAccountId: props.bankAccountId,
      userName: props.userName,
      userRole: props.userRole,
    });
    setSavedCard({});
    setEdited(false);
    if (props.admin == true) {
      setRedirect('/creditcards');
    }
  }
  useEffect(() => {
    props.clearCreditCard();
  }, []);
  useEffect(() => {
    setNumber('');
    setCvc('');
    setOwnerName('');
    if (props.id) {
      props.getCreditCard(props.id, props.token);
    }
  }, [props.id]);

  useEffect(() => {
    if (props.creditCard) {
      setNumber(props.creditCard.number);
      setCvc(props.creditCard.cvc);
      setOwnerName(props.creditCard.ownerName);
      setSavedCard({
        number: props.creditCard.number,
        cvc: props.creditCard.cvc,
        ownerName: props.creditCard.ownerName,
      });
    }
  }, [props.creditCard]);

  useEffect(() => {
    if (
      number !== savedCard.number ||
      cvc !== savedCard.cvc ||
      ownerName != savedCard.ownerName
    ) {
      setEdited(true);
    } else {
      setEdited(false);
    }
    if (number == undefined) {
      setNumber('');
      setSavedCard({ number: '', cvc: '', ownerName: '' });
    }
    if (cvc == undefined) {
      setCvc('');
      setSavedCard({ number: '', cvc: '', ownerName: '' });
    }
    if (ownerName == undefined) {
      setOwnerName('');
      setSavedCard({ number: '', cvc: '', ownerName: '' });
    }
  }, [number, cvc, ownerName]);
  if (redirect) {
    return <Redirect to={redirect} />;
  }
  if (!props.userId) {
    return <h2>Please login to view creditcard.</h2>;
  } else {
    if (
      props.creditCard.id != undefined &&
      props.id != null &&
      props.id != 'undefined'
    ) {
      if (
        (props.id == props.creditCardId && props.creditCardId != undefined) ||
        (props.userRole === 1 && props.admin === true)
      ) {
        return (
          <div>
            <h2>Edit credit card</h2>
            {edited ? <p>Press 'Update credit card' to save changes.</p> : ''}
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="number">Credit card number: </label>
              <input
                type="text"
                name="number"
                minLength="1"
                maxLength="20"
                required
                value={number}
                onChange={handleNumberChange}
              />
              <br />
              <label htmlFor="cvc">CVC: </label>
              <input
                type="text"
                name="cvc"
                minLength="3"
                maxLength="4"
                required
                value={cvc}
                onChange={handleCvcChange}
              />
              <br />
              <label htmlFor="ownerName">Credit card owner name: </label>
              <input
                type="text"
                name="ownerName"
                minLength="1"
                maxLength="50"
                required
                value={ownerName}
                onChange={handleOwnerNameChange}
              />
              <br />
              <button type="submit">Update credit card</button>
              <button type="button" onClick={handleDelete}>
                Delete credit card
              </button>
            </form>
          </div>
        );
      }
    } else {
      if (props.id === props.creditCardId) {
        return (
          <div>
            <h2>Add credit card</h2>
            {props.creditCard && props.creditCard.message ? (
              <p>
                Adding credit card failed! Are you sure the number is correct?
              </p>
            ) : (
              ''
            )}
            <form onSubmit={handleAddSubmit}>
              <label htmlFor="number">Credit card number: </label>
              <input
                type="text"
                name="number"
                minLength="1"
                maxLength="20"
                required
                value={number}
                onChange={handleNumberChange}
              />
              <br />
              <label htmlFor="cvc">CVC: </label>
              <input
                type="text"
                name="cvc"
                minLength="3"
                maxLength="4"
                required
                value={cvc}
                onChange={handleCvcChange}
              />
              <br />
              <label htmlFor="ownerName">Credit card owner name: </label>
              <input
                type="text"
                name="ownerName"
                minLength="1"
                maxLength="50"
                required
                value={ownerName}
                onChange={handleOwnerNameChange}
              />
              <br />
              <button type="submit">Add credit card</button>
            </form>
          </div>
        );
      } else {
        if (props.userRole === 1) {
          return (
            <div>
              <h2>Edit credit card</h2>
              {edited ? <p>Press 'Update credit card' to save changes.</p> : ''}
              <form onSubmit={handleEditSubmit}>
                <label htmlFor="number">Credit card number: </label>
                <input
                  type="text"
                  name="number"
                  minLength="1"
                  maxLength="20"
                  required
                  value={number}
                  onChange={handleNumberChange}
                />
                <br />
                <label htmlFor="cvc">CVC: </label>
                <input
                  type="text"
                  name="cvc"
                  minLength="3"
                  maxLength="4"
                  required
                  value={cvc}
                  onChange={handleCvcChange}
                />
                <br />
                <label htmlFor="ownerName">Credit card owner name: </label>
                <input
                  type="text"
                  name="ownerName"
                  minLength="1"
                  maxLength="50"
                  required
                  value={ownerName}
                  onChange={handleOwnerNameChange}
                />
                <br />
                <button type="submit">Update credit card</button>
                <button type="button" onClick={handleDelete}>
                  Delete credit card
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
  creditCardId: state.user.creditCardId,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
  userName: state.user.name,
  creditCard: state.creditCardsReducer,
  bankAccountId: state.user.bankAccountId,
  user: state.user,
});
const mapDispatchToProps = (dispatch) => {
  return {
    addCreditCard: (form, token, user) =>
      dispatch(addCreditCard(form, token, user)),
    editCreditCard: (form, token, id) =>
      dispatch(editCreditCard(form, token, id)),
    getCreditCard: (id, token) => dispatch(getCreditCard(id, token)),
    deleteCreditCard: (token, id, user) =>
      dispatch(deleteCreditCard(token, id, user)),
    clearCreditCard: () => dispatch(clearCreditCard()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreditCard);
