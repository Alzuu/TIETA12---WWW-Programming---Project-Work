import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteItem, fetchItem } from '../actions/items';
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
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

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
      <Box className="listItemBox">
        <Typography variant="h2">Loading...</Typography>
      </Box>
    );
  } else {
    if (!confirmed) {
      return (
        <Box className="addItemBox">
          <Card className="itemCard">
            <CardActionArea>
              <CardHeader title={`Confirm removal of ${props.item.name}?`} />

              <CardContent>
                <Typography variant="body">
                  If you confirm removal, item will be permanently deleted.
                </Typography>
              </CardContent>

              <CardActions className="buttons">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDelete}
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
          <Alert severity="success" className="warningBox">
            <AlertTitle>Success</AlertTitle>
            Item deleted succesfully! Redirecting...
          </Alert>
        </Box>
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
