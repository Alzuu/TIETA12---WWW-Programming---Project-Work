import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchItem } from '../actions/items';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import './items.css';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

function BuyItemPage(props) {
  function fetchItem(id) {
    props.fetchItem(id, props.token);
  }
  useEffect(() => {
    fetchItem(props.match.params.id);
  }, []);
  if (props.item != undefined) {
    if (props.item.auth != false) {
      return (
        <Box className="addItemBox">
          <Card className="itemCard">
            <CardActionArea>
              <CardMedia
                component="img"
                width="200px"
                src={
                  '../../../itemimages/' +
                  (props.item.pictureId === '' ||
                  props.item.pictureId == undefined
                    ? 'nologo.png'
                    : props.item.pictureId)
                }
              />
              <CardContent>
                <Typography variant="h4">{props.item.name}</Typography>
                <Typography variant="body1">
                  Price: {props.item.price} €
                  <br />
                  {props.item.ownerId === props.userId
                    ? `On sale: ${props.item.onSale.toString()}`
                    : ''}
                </Typography>
              </CardContent>
              <CardActions>
                <Link
                  component={RouterLink}
                  to={'/users/' + props.item.ownerId + '/items'}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={
                      props.item.ownerId === props.userId ? (
                        <HomeIcon />
                      ) : (
                        <ListIcon />
                      )
                    }
                  >
                    {props.item.ownerId === props.userId
                      ? 'List own items'
                      : 'List seller items'}
                  </Button>
                </Link>

                {props.item.ownerId !== props.userId ? (
                  <Link
                    component={RouterLink}
                    to={'/items/' + props.item._id + '/buy/confirm'}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EuroSymbolIcon />}
                    >
                      Buy item
                    </Button>
                  </Link>
                ) : (
                  <Link
                    component={RouterLink}
                    to={'/items/' + props.item._id + '/edit'}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                      Edit item
                    </Button>
                  </Link>
                )}
              </CardActions>
            </CardActionArea>
          </Card>
        </Box>
      );
    } else {
      return (
        <Box className="addItemBox">
          <Alert severity="warning" className="warningBox">
            <AlertTitle>Warning</AlertTitle>
            Please log in to view item.
          </Alert>
        </Box>
      );
    }
  } else {
    return (
      <Box className="addItemBox">
        <Alert severity="info" className="warningBox">
          <AlertTitle>Info</AlertTitle>
          Loading item...
        </Alert>
      </Box>
    );
  }
}
const mapStateToProps = (state) => ({
  item: state.itemsReducer.item,
  token: state.user.token,
  userId: state.user.id,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchItem: (id, token) => dispatch(fetchItem(id, token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BuyItemPage);
