import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUserItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';

function UserItemsPage(props) {
  function fetchItems(id, token) {
    props.fetchUserItems(id, token);
  }
  useEffect(() => {
    fetchItems(props.match.params.id, props.token);
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
          <h2>Please login to view users items.</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h2>User {props.match.params.id} items</h2>
          <ItemList
            items={props.items}
            userId={props.userId}
            userRole={props.userRole}
            type="user"
          />
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  items: state.itemsReducer.userItems,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserItems: (id, token) => dispatch(fetchUserItems(id, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserItemsPage);
