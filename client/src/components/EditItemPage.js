import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateItem, fetchEditItem } from '../actions/items';
import './items.css';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
function EditItemPage(props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0.0);
  const [onSale, setOnSale] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [itemUpdated, setItemUpdated] = useState(false);

  useEffect(() => {
    props.fetchEditItem(props.match.params.id, props.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.item) {
      setName(props.item.name);
      setPrice(props.item.price);
      setOnSale(props.item.onSale);
      if (props.updateItem) {
        setTimeout(() => {
          setRedirect(`/items/${props.item._id}/buy`);
        }, 3000);
      }
    }
  }, [props]);

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handlePriceChange(e) {
    setPrice(e.target.value);
  }
  function handleOnSaleChange(e) {
    setOnSale(e.target.checked);
  }
  function handleClick(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const jsonData = {
        name: name,
        price: price,
        onSale: onSale,
      };
      props.updateItem(props.item._id, jsonData, props.token);
      setItemUpdated(true);
      setRedirect(null);
    }
  }
  function handleCancel(e) {
    e.preventDefault();
    setItemUpdated(true);
    setRedirect('/');
  }
  if (redirect && itemUpdated) {
    return <Redirect to={redirect} />;
  }
  if (props.token) {
    if (!redirect && itemUpdated) {
      return (
        <Box className="addItemBox">
          <Alert severity="success" className="warningBox">
            <AlertTitle>Success</AlertTitle>
            Item updated succesfully! Redirecting...
          </Alert>
        </Box>
      );
    } else if (props.item) {
      return (
        <Box className="addItemBox">
          <Typography variant="h2">Edit item {props.item._id}</Typography>
          <form onSubmit={handleClick} className="addItemBox">
            <TextField
              label="Item name"
              type="text"
              name="name"
              value={name}
              minLength="1"
              required
              onChange={handleNameChange}
            />
            <TextField
              label="Item price"
              type="number"
              name="price"
              value={price}
              min="0.01"
              step="0.01"
              required
              onChange={handlePriceChange}
            />
            <FormControlLabel
              label="On sale"
              control={
                <Checkbox
                  name="onsale"
                  checked={onSale}
                  onChange={handleOnSaleChange}
                  color="primary"
                />
              }
            />
            <FormGroup row={true}>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                startIcon={<CheckIcon />}
              >
                Update item
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
            </FormGroup>
          </form>
        </Box>
      );
    } else {
      return <h2>Loading item...</h2>;
    }
  } else {
    return (
      <div>
        <h2>Please login to edit item.</h2>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  item: state.itemsReducer.editItem,
  updateItem: state.itemsReducer.updateItem,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    updateItem: (id, form, token) => dispatch(updateItem(id, form, token)),
    fetchEditItem: (id, token) => dispatch(fetchEditItem(id, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditItemPage);
