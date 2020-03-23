import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUserItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Box from '@material-ui/core/Box';

function UserItemsPage(props) {
  function fetchItems(id, token) {
    props.fetchUserItems(id, token);
  }
  useEffect(() => {
    fetchItems(props.match.params.id, props.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!props.items) {
    return (
      <Box className="listItemBox">
        <Typography variant="h2">Loading...</Typography>
      </Box>
    );
  } else {
    if (props.items && props.items.auth === false) {
      return (
        <Box className="listItemBox">
          <Alert severity="warning" className="warningBox">
            <AlertTitle>Warning</AlertTitle>
            Please login as shopkeeper or admin to view customer items.
          </Alert>
        </Box>
      );
    } else {
      return (
        <div>
          <Typography variant="h2">
            {props.userId === props.match.params.id
              ? 'Own items'
              : `User ${props.match.params.id} items`}
          </Typography>
          <ItemList
            items={props.items}
            userId={props.userId}
            userRole={props.userRole}
            type={props.userId === props.match.params.id ? 'own' : 'user'}
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
