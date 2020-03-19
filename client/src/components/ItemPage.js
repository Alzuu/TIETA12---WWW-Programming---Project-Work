import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchShopkeeperItems } from '../actions/items';
import ItemList from './ItemList';
import './ItemPage.css';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

function ItemPage(props) {
  function fetchItems() {
    props.fetchShopkeeperItems();
  }
  useEffect(() => {
    fetchItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!props.items) {
    return (
      <Box className="listItemBox">
        <Typography variant="h2">Loading...</Typography>
      </Box>
    );
  } else {
    return (
      <Box>
        <Typography variant="h2">Items for sale</Typography>
        <ItemList
          items={props.items}
          userId={props.userId ? props.userId : ''}
          userRole={props.userRole ? props.userRole : 3}
          type="shopkeeper"
        />
      </Box>
    );
  }
}
const mapStateToProps = (state) => ({
  items: state.itemsReducer.items,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchShopkeeperItems: () => dispatch(fetchShopkeeperItems()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemPage);
