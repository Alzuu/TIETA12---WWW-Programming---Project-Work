import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { addItem } from '../actions/items';

function AddItemPage(props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0.0);
  const [onSale, setOnSale] = useState(true);
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [itemAdded, setItemAdded] = useState(false);

  const fileRef = useRef();
  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handlePriceChange(e) {
    setPrice(e.target.value);
  }
  function handleOnSaleChange(e) {
    setOnSale(e.target.checked);
  }
  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setFileSize(e.target.files[0].size);
  }
  function validateFileSize(size) {
    const MAXSIZE = 5242880; // Maximum file size: 5MB
    if (size === null || size <= MAXSIZE) {
      return true;
    } else {
      return false;
    }
  }
  function handleClick(e) {
    e.preventDefault();
    if (e.target.checkValidity() && validateFileSize(fileSize)) {
      const form = new FormData();
      form.append('name', name);
      form.append('price', price);
      form.append('ownerId', props.userId);
      form.append('ownerIsCustomer', props.userRole === 3 ? true : false);
      form.append('onSale', onSale);
      if (file != null) {
        form.append('image', file);
      }
      props.addItem(form, props.token);
      setItemAdded(true);
      setRedirect(null);
    }
  }
  function handleRemovePicture(e) {
    fileRef.current.value = '';
    setFile(null);
    setFileSize(null);
  }

  useEffect(() => {
    if (props.item) {
      setTimeout(() => {
        setRedirect(`/items/${props.item._id}/buy`);
      }, 3000);
    }
  }, [props]);
  if (props.token) {
    if (!redirect && itemAdded) {
      return <h2>Item added. Redirecting...</h2>;
    }
    if (redirect && itemAdded) {
      return <Redirect to={redirect} />;
    } else {
      return (
        <div>
          <h2>Add new item</h2>
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
            <label htmlFor="picture">(optional) Add picture: </label>
            <input
              type="file"
              ref={fileRef}
              name="picture"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {file !== null ? (
              <button onClick={handleRemovePicture}>Remove picture</button>
            ) : (
              ''
            )}
            <br />
            {validateFileSize(fileSize) ? (
              ''
            ) : (
              <p>File size too big! (max 5MB)</p>
            )}
            <button type="submit">Add item</button>
          </form>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h2>Login to add new item</h2>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  item: state.itemsReducer.newItem,
  token: state.user.token,
  userId: state.user.userId,
  userRole: state.user.userRole,
});
const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (form, token) => dispatch(addItem(form, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddItemPage);
