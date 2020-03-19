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
import './creditcards.css';
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
function CreditCard(props) {
  const [savedCard, setSavedCard] = useState({});
  const [number, setNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [edited, setEdited] = useState(false);
  const [redirect, setRedirect] = useState(null);

  function handleAddSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const card = {
        number: number,
        CVC: cvc,
        ownerName: ownerName,
      };
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
      setSavedCard({
        number: number,
        cvc: cvc,
        ownerName: ownerName,
      });
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setNumber('');
    setCvc('');
    setOwnerName('');
    if (props.id && props.id != 'undefined') {
      props.getCreditCard(props.id, props.token);
    }
  }, [props.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.id && props.creditCard && props.creditCard.number !== undefined) {
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
      setSavedCard({
        number: '',
        cvc: '',
        ownerName: '',
      });
    }
    if (cvc == undefined) {
      setCvc('');
      setSavedCard({
        number: '',
        cvc: '',
        ownerName: '',
      });
    }
    if (ownerName == undefined) {
      setOwnerName('');
      setSavedCard({
        number: '',
        cvc: '',
        ownerName: '',
      });
    }
  }, [number, cvc, ownerName]); // eslint-disable-line react-hooks/exhaustive-deps
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
      props.creditCard.id != undefined &&
      props.id != null &&
      props.id != 'undefined'
    ) {
      if (
        (props.id == props.creditCardId && props.creditCardId != undefined) ||
        (props.userRole === 1 && props.admin === true)
      ) {
        return (
          <Box className="creditCardBox">
            <Typography variant="h2">Edit credit card</Typography>
            {edited ? (
              <Alert severity="info">Press 'Update' to save changes.</Alert>
            ) : (
              ''
            )}
            <form onSubmit={handleEditSubmit} className="creditCardBox">
              <TextField
                label="Credit card number"
                type="text"
                name="number"
                minLength="1"
                maxLength="20"
                required
                value={number}
                onChange={handleNumberChange}
              />
              <TextField
                label="Credit card CVC"
                type="text"
                name="cvc"
                minLength="3"
                maxLength="4"
                required
                value={cvc}
                onChange={handleCvcChange}
              />
              <TextField
                label="Credit card owner name"
                type="text"
                name="ownerName"
                minLength="1"
                maxLength="50"
                required
                value={ownerName}
                onChange={handleOwnerNameChange}
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
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                  color="secondary"
                  variant="outlined"
                >
                  Delete
                </Button>
              </FormGroup>
            </form>
          </Box>
        );
      }
    } else {
      if (props.id === props.creditCardId) {
        return (
          <Box className="creditCardBox">
            <Typography variant="h2">Add credit card</Typography>
            {props.creditCard && props.creditCard.message ? (
              <Alert severity="error" className="warningBox">
                Adding credit card failed! Are you sure the number is correct?
              </Alert>
            ) : (
              ''
            )}
            <form onSubmit={handleAddSubmit} className="creditCardBox">
              <TextField
                label="Credit card number"
                type="text"
                name="number"
                minLength="1"
                maxLength="20"
                required
                value={number}
                onChange={handleNumberChange}
              />
              <TextField
                label="Credit card CVC"
                type="text"
                name="cvc"
                minLength="3"
                maxLength="4"
                required
                value={cvc}
                onChange={handleCvcChange}
              />
              <TextField
                label="Credit card owner name"
                type="text"
                name="ownerName"
                minLength="1"
                maxLength="50"
                required
                value={ownerName}
                onChange={handleOwnerNameChange}
              />

              <Button
                type="submit"
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add credit card
              </Button>
            </form>
          </Box>
        );
      } else {
        if (props.userRole === 1) {
          return (
            <Box className="creditCardBox">
              <Typography variant="h2">Edit credit card</Typography>
              {edited ? (
                <Alert severity="info">Press 'Update' to save changes.</Alert>
              ) : (
                ''
              )}
              <form onSubmit={handleEditSubmit} className="creditCardBox">
                <TextField
                  label="Credit card number"
                  type="text"
                  name="number"
                  minLength="1"
                  maxLength="20"
                  required
                  value={number}
                  onChange={handleNumberChange}
                />
                <TextField
                  label="Credit card CVC"
                  type="text"
                  name="cvc"
                  minLength="3"
                  maxLength="4"
                  required
                  value={cvc}
                  onChange={handleCvcChange}
                />
                <TextField
                  label="Credit card owner name"
                  type="text"
                  name="ownerName"
                  minLength="1"
                  maxLength="50"
                  required
                  value={ownerName}
                  onChange={handleOwnerNameChange}
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
                    onClick={handleDelete}
                    startIcon={<DeleteIcon />}
                    color="secondary"
                    variant="outlined"
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
