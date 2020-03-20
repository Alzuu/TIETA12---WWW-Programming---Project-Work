import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCreditCards } from '../actions/creditCards';
import './ItemPage.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

function ListCreditCardsPage(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    props.getCreditCards(props.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (props.creditCards) {
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, props.creditCards.length - page * rowsPerPage);
    return (
      <Box>
        <Typography variant="h2">All credit cards</Typography>
        <TableContainer>
          <Table className="itemList">
            <TableHead>
              <TableRow>
                <TableCell>Card id</TableCell>
                <TableCell>Edit card</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.creditCards
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((card) => (
                  <TableRow key={card._id}>
                    <TableCell>{card._id}</TableCell>
                    <TableCell>
                      <Link to={`/creditcards/${card._id}`}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 113 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={props.creditCards.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    );
  } else {
    return (
      <Box className="listItemBox">
        <Alert severity="info" className="warningBox">
          <AlertTitle>Info</AlertTitle>
          No credit cards.
        </Alert>
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  creditCards: state.creditCardsReducer.allCards,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    getCreditCards: (token) => dispatch(getCreditCards(token)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCreditCardsPage);
