import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { buyItem } from '../actions/items';

function ConfirmBuyPage(props) {
  const [redirect, setRedirect] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  function handleCancel() {
    setRedirect('/items/' + props.item._id + '/buy');
  }
  function handlePurchase() {
    props.buyItem(props.item._id, props.token, props.userId);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setRedirect('/');
    }, 5000);
  }
  if (redirect) {
    return <Redirect to={redirect} />;
  }

  if (props.item !== undefined) {
    if (confirmed && props.item.ownerId === props.userId) {
      return (
        <div>
          <h2>Purchase confirmed!</h2>
          Redirecting to home in a few seconds...
        </div>
      );
    }
    if (confirmed && props.item.ownerId !== props.userId) {
      return (
        <div>
          <h2>Purchase failed!</h2>
          Redirecting to home in a few seconds...
        </div>
      );
    }
    if (props.item.auth !== false) {
      return (
        <div>
          <h2>Confirm purchase of {props.item.name}?</h2>
          If you confirm purchase, your credit card will be automatically
          charged and the item will be delivered to you.
          <br />
          <button onClick={handlePurchase}>Yes</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Please log in to view item.</h2>
        </div>
      );
    }
  }
  return (
    <div>
      <h2>Loading item...</h2>
    </div>
  );
}

const mapStateToProps = (state) => ({
  item: state.itemsReducer.item,
  token: state.user.token,
  userId: state.user.userId,
});
const mapDispatchToProps = (dispatch) => {
  return {
    buyItem: (id, token, userId) => dispatch(buyItem(id, token, userId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmBuyPage);
