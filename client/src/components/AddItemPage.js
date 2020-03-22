import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { addItem } from '../actions/items';
import './items.css';
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
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';

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
    // Validate form information
    if (e.target.checkValidity() && validateFileSize(fileSize)) {
      // Construct form data
      const form = new FormData();
      form.append('name', name);
      form.append('price', price);
      form.append('ownerId', props.userId);
      form.append('ownerIsCustomer', props.userRole === 2 ? false : true);
      form.append('onSale', onSale);
      if (file != null) {
        form.append('image', file);
      }
      // Add new item
      props.addItem(form, props.token);
      setItemAdded(true);
      setRedirect(null);
    }
  }
  function handleAddPictureClick(e) {
    if (!file) {
      fileRef.current.click();
    } else {
      handleRemovePicture(e);
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
        // if item added, add redirect to show item
        setRedirect(`/items/${props.item._id}/buy`);
      }, 3000);
    }
  }, [props]);
  if (props.token) {
    if (!redirect && itemAdded) {
      return (
        <Box className="addItemBox">
          <Alert severity="success" className="warningBox">
            <AlertTitle>Success</AlertTitle>
            Item added succesfully! Redirecting...
          </Alert>
        </Box>
      );
    }
    if (redirect && itemAdded) {
      return <Redirect to={redirect} />;
    } else {
      if (
        props.bankAccountId &&
        props.bankAccountId !== '' &&
        props.bankAccountId !== 'undefined'
      ) {
        return (
          <Box className="addItemBox">
            <Typography variant="h2">Add new item</Typography>
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
              <FormLabel>Add optional picture</FormLabel>
              <FormControlLabel
                label={file ? file.name : null}
                control={
                  <Button
                    variant="outlined"
                    color={file ? 'secondary' : 'primary'}
                    startIcon={file ? <DeleteIcon /> : <ImageIcon />}
                    style={{ margin: 5 }}
                    onClick={handleAddPictureClick}
                  >
                    {file ? 'Delete picture' : 'Add picture'}
                  </Button>
                }
              />

              <input
                style={{ display: 'none' }}
                type="file"
                ref={fileRef}
                name="picture"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />

              {validateFileSize(fileSize) ? (
                ''
              ) : (
                <Alert severity="error">File size too big! (max 5MB)</Alert>
              )}
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                startIcon={<AddIcon />}
              >
                Add item
              </Button>
            </form>
          </Box>
        );
      } else {
        return (
          <Box className="addItemBox">
            <Alert severity="warning" className="warningBox">
              <AlertTitle>Warning</AlertTitle>
              Please add bank account to sell items.
            </Alert>
          </Box>
        );
      }
    }
  } else {
    return (
      <Box className="addItemBox">
        <Alert severity="warning" className="warningBox">
          <AlertTitle>Warning</AlertTitle>
          Please login to add new item.
        </Alert>
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  item: state.itemsReducer.newItem,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
  bankAccountId: state.user.bankAccountId,
});
const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (form, token) => dispatch(addItem(form, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddItemPage);
