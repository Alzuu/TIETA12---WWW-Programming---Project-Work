import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateItem, fetchEditItem } from '../actions/items';

function EditItemPage(props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0.0);
  const [onSale, setOnSale] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [itemUpdated, setItemUpdated] = useState(false);
  useEffect(() => {
    props.fetchEditItem(props.match.params.id, props.token);
  }, []);
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
      return <h2>Item updated. Redirecting...</h2>;
    } else if (props.item) {
      return (
        <div>
          <h2>Edit item {props.item._id}</h2>
          <form onSubmit={handleClick}>
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              value={name}
              minLength="1"
              required
              onChange={handleNameChange}
            />
            <br />
            <label htmlFor="price">Price: </label>
            <input
              type="number"
              name="price"
              value={price}
              min="0.01"
              step="0.01"
              required
              onChange={handlePriceChange}
            />
            <br />
            <label htmlFor="onsale">Put on sale: </label>
            <input
              type="checkbox"
              name="onsale"
              checked={onSale}
              onChange={handleOnSaleChange}
            />
            <br />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Update item</button>
          </form>
        </div>
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
  userId: state.user.userId,
  userRole: state.user.userRole,
});
const mapDispatchToProps = (dispatch) => {
  return {
    updateItem: (id, form, token) => dispatch(updateItem(id, form, token)),
    fetchEditItem: (id, token) => dispatch(fetchEditItem(id, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditItemPage);
