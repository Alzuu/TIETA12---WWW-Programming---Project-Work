import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchAllItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';

function AllItemsPage(props) {
  function fetchItems(token) {
    props.fetchAllItems(token);
  }
  useEffect(() => {
    fetchItems(props.token);
  }, []);
  if (!props.items) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else {
    if (props.items && props.items.auth === false) {
      return (
        <div>
          <h2>Please login as admin to view all items.</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h2>All items</h2>
          <ItemList
            items={props.items}
            userId={props.userId}
            userRole={props.userRole}
            type="all"
          />
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  items: state.itemsReducer.allItems,
  token: state.user.token,
  userId: state.user.userId,
  userRole: state.user.userRole,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllItems: (token) => dispatch(fetchAllItems(token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AllItemsPage);
