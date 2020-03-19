import React from 'react';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import StorefrontIcon from '@material-ui/icons/Storefront';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

function ItemList(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (props.items.length > 0) {
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, props.items.length - page * rowsPerPage);
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Picture</TableCell>
              <TableCell>Item name</TableCell>
              <TableCell>Price (€)</TableCell>
              {props.type === 'user' || props.type === 'own' ? (
                ''
              ) : (
                <TableCell>All seller items</TableCell>
              )}
              {props.type === 'own' ? <TableCell>On sale</TableCell> : ''}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <img
                      alt="Item"
                      width="100px"
                      height="100px"
                      src={
                        (props.type === 'shopkeeper'
                          ? 'itemimages/'
                          : '../../itemimages/') +
                        (item.pictureId === '' ||
                        item.pictureId === null ||
                        item.pictureId === undefined
                          ? 'nologo.png'
                          : item.pictureId)
                      }
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  {props.type === 'user' || props.type === 'own' ? (
                    ''
                  ) : (
                    <TableCell>
                      <Link to={'/users/' + item.ownerId + '/items'}>
                        <IconButton color="primary">
                          {props.type === 'shopkeeper' ? (
                            <StorefrontIcon />
                          ) : (
                            <EmojiPeopleIcon />
                          )}
                        </IconButton>
                      </Link>
                    </TableCell>
                  )}
                  {props.type === 'own' ? (
                    <TableCell>{item.onSale.toString()}</TableCell>
                  ) : (
                    ''
                  )}

                  <TableCell>
                    <Link to={'/items/' + item._id + '/buy'}>
                      <IconButton color="primary">
                        <SearchIcon />
                      </IconButton>
                    </Link>
                    {item.ownerId === props.userId || props.userRole === 1 ? (
                      <Link to={'/items/' + item._id + '/edit'}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    ) : (
                      ''
                    )}
                    {item.ownerId === props.userId || props.userRole === 1 ? (
                      <Link to={'/items/' + item._id + '/delete'}>
                        <IconButton color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </Link>
                    ) : (
                      ''
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 113 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={5}
                count={props.items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  } else {
    return (
      <Box className="listItemBox">
        <Alert severity="info" className="warningBox">
          <AlertTitle>Info</AlertTitle>
          No items.
        </Alert>
      </Box>
    );
  }
}
export default ItemList;
