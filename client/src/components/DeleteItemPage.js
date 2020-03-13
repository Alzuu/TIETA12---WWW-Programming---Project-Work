import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteItem, fetchItem } from '../actions/items';

function DeleteItemPage(props) {
  const [redirect, setRedirect] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  function handleCancel() {
    setRedirect('/items/' + props.item._id + '/buy');
  }
  function handleDelete() {
    props.deleteItem(props.item._id, props.token, props.userId);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setRedirect('/');
    }, 5000);
  }
  useEffect(() => {
    props.fetchItem(props.match.params.id, props.token);
  }, []);
  if (redirect) {
    return <Redirect to={redirect} />;
  }

  if (!props.item) {
    return (
      <div>
        <h2>Loading item...</h2>
      </div>
    );
  } else {
    if (!confirmed) {
      return (
        <div>
          <h2>Confirm removal of {props.item.name}?</h2>
          Item will be permanently deleted.
          <br />
          <button onClick={handleDelete}>Yes</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      );
    } else {
      return (
        <div>
          <h2>{props.item.name} deleted. Redirecting...</h2>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  item: state.itemsReducer.item,
  deletedItem: state.itemsReducer.deleteItem,
  token: state.user.token,
});
const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (id, token) => dispatch(deleteItem(id, token)),
    fetchItem: (id, token) => dispatch(fetchItem(id, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DeleteItemPage);
