import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchShopkeeperItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';

function ItemPage(props) {
  function fetchItems() {
    props.fetchShopkeeperItems();
  }
  useEffect(() => {
    fetchItems();
  }, []);
  console.log(props.items);
  if (!props.items) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    <div>
      <h2>Items for sale</h2>
      <ItemList items={props.items} type="shopkeeper" />
    </div>
  );
}
const mapStateToProps = (state) => ({
  items: state.itemsReducer.items,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchShopkeeperItems: () => dispatch(fetchShopkeeperItems()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemPage);
