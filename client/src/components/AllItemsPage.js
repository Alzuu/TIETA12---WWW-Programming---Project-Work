import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchAllItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Box from '@material-ui/core/Box';
function AllItemsPage(props) {
  function fetchItems(token) {
    props.fetchAllItems(token);
  }
  useEffect(() => {
    fetchItems(props.token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            Please login as admin to view all items.
          </Alert>
        </Box>
      );
    } else {
      return (
        <Box className="listItemBox">
          <Typography variant="h2">All items</Typography>
          <ItemList
            items={props.items}
            userId={props.userId}
            userRole={props.userRole}
            type="all"
          />
        </Box>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  items: state.itemsReducer.allItems,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllItems: (token) => dispatch(fetchAllItems(token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AllItemsPage);
