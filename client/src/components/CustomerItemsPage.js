import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCustomerItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';
import './ItemPage.css';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Box from '@material-ui/core/Box';
function CustomerItemsPage(props) {
  function fetchItems(token) {
    props.fetchCustomerItems(token);
  }
  useEffect(() => {
    fetchItems(props.token);
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
        <Box>
          <Typography variant="h2">Customer items for sale</Typography>
          <ItemList
            items={props.items}
            userId={props.userId}
            userRole={props.userRole}
            type="customer"
          />
        </Box>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  items: state.itemsReducer.customerItems,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCustomerItems: (token) => dispatch(fetchCustomerItems(token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomerItemsPage);
