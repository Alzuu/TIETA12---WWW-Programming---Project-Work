import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchItem } from '../actions/items';

function BuyItemPage(props) {
  function fetchItem(id) {
    props.fetchItem(id, props.token);
  }
  useEffect(() => {
    console.log(props);
    fetchItem(props.match.params.id);
  }, []);
  if (props.item != undefined) {
    if (props.item.auth != false) {
      return (
        <div>
          <h2>{props.item.name}</h2>
          <img
            width="300px"
            src={
              '../../itemimages/' +
              (props.item.pictureId === ''
                ? 'nologo.png'
                : props.item.pictureId)
            }
          />
          <br />
          Price: {props.item.price}
          <br />
          <Link to={'/users/' + props.item.ownerId + '/items'}>
            Seller items
          </Link>
          <br />
          <Link to={'/items/' + props.item._id + '/buy/confirm'}>Buy item</Link>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Please log in to view item.</h2>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h2>Loading item...</h2>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  item: state.itemsReducer.item,
  token: state.user.token,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchItem: (id, token) => dispatch(fetchItem(id, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BuyItemPage);
