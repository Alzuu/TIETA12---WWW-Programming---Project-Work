import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { buyItem } from '../actions/items';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import './items.css';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

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
        <Box className="addItemBox">
          <Alert severity="success" className="warningBox">
            <AlertTitle>Success</AlertTitle>
            Purchase confirmed! Redirecting to home...
          </Alert>
        </Box>
      );
    }
    if (confirmed && props.item.ownerId !== props.userId) {
      return (
        <Box className="addItemBox">
          <Alert severity="error" className="warningBox">
            <AlertTitle>Error</AlertTitle>
            Purchase failed! Redirecting to home...
          </Alert>
        </Box>
      );
    }
    if (props.item.auth !== false) {
      if (props.item.ownerId !== props.userId) {
        if (props.creditCardId) {
          return (
            <Box className="addItemBox">
              <Card className="itemCard">
                <CardActionArea>
                  <CardHeader
                    title={`Confirm purchase of ${props.item.name}?`}
                  />

                  <CardContent>
                    <Typography variant="body">
                      If you confirm purchase, your credit card will be
                      automatically charged and the item will be delivered to
                      you.
                    </Typography>
                  </CardContent>

                  <CardActions className="buttons">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handlePurchase}
                      startIcon={<CheckIcon />}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                      startIcon={<CloseIcon />}
                    >
                      Cancel
                    </Button>
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
                Please add credit card to buy items.
              </Alert>
            </Box>
          );
        }
      } else {
        return (
          <Box className="addItemBox">
            <Alert severity="warning" className="warningBox">
              <AlertTitle>Warning</AlertTitle>
              Purchase of own item prohibited.
            </Alert>
          </Box>
        );
      }
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
  }
  return (
    <Box className="addItemBox">
      <Alert severity="info" className="warningBox">
        <AlertTitle>Info</AlertTitle>
        Loading item...
      </Alert>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  item: state.itemsReducer.item,
  token: state.user.token,
  userId: state.user.id,
  creditCardId: state.user.creditCardId,
});
const mapDispatchToProps = (dispatch) => {
  return {
    buyItem: (id, token, userId) => dispatch(buyItem(id, token, userId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmBuyPage);
