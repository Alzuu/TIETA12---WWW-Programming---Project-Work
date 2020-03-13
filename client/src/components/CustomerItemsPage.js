import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCustomerItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';

function CustomerItemsPage(props) {
  function fetchItems(token) {
    props.fetchCustomerItems(token);
  }
  useEffect(() => {
    fetchItems(props.token);
  }, []);
  console.log(props.items);
  if (!props.items) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }
  if (props.items && props.items.auth === false) {
    return (
      <div>
        <h2>Please login as shopkeeper or admin to view customer items.</h2>
      </div>
    );
  }
  return (
    <div>
      <h2>Customer items for sale</h2>
      <ItemList
        items={props.items}
        userId={props.userId}
        userRole={props.userRole}
        type="customer"
      />
    </div>
  );
}
const mapStateToProps = (state) => ({
  items: state.itemsReducer.customerItems,
  token: state.user.token,
  userId: state.user.userId,
  userRole: state.user.userRole,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCustomerItems: (token) => dispatch(fetchCustomerItems(token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomerItemsPage);
