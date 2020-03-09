import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchShopkeeperItems } from '../actions/items';

function ItemPage(props) {
  function fetchItems() {
    props.fetchShopkeeperItems();
  }
  console.log(props);
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <div>
      <h2>Items for sale</h2>
      <table>
        <tr>
          <th>Picture</th>
          <th>Item name</th>
          <th>Price</th>
          <th>Seller items</th>
          <th>Buy item</th>
        </tr>
        {props.items.map((item) => (
          <tr>
            <td>
              <img width="100px" src={'static/media/items/' + item.pictureId} />
            </td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>
              <Link to={'/users/' + item.ownerId + '/items'}>Seller items</Link>
            </td>
            <td>
              <Link to={'/items/' + item._id + '/buy'}>Buy item</Link>
            </td>
          </tr>
        ))}
      </table>
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
