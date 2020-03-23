import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListIcon from '@material-ui/icons/List';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { toggleDarkMode } from '../actions/darkMode';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

function Navigation(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const userIsAdmin = () => props.user.role === 1;
  const userIsShopkeeper = () => props.user.role === 2;
  function handleMenu(e) {
    setAnchorEl(e.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  function handleDarkMode() {
    props.toggleDarkMode(!darkMode);
    setDarkMode(!darkMode);
  }
  return (
    <AppBar position="sticky" className="navigationbar">
      <Toolbar>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          minWidth="100%"
        >
          <Box display="flex" flexDirection="row">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <IconButton>
                <StorefrontIcon />
                <Typography>Items for sale</Typography>
              </IconButton>
            </Link>
            {props.user ? (
              <Box>
                <Link to="/items/add" style={{ textDecoration: 'none' }}>
                  <IconButton>
                    <AddIcon />
                    <Typography>Add item</Typography>
                  </IconButton>
                </Link>
                <Link
                  to={`/users/${props.user.id}/items`}
                  style={{ textDecoration: 'none' }}
                >
                  <IconButton>
                    <HomeIcon />
                    <Typography>Own items</Typography>
                  </IconButton>
                </Link>
              </Box>
            ) : (
              ''
            )}
            {userIsAdmin() || userIsShopkeeper() ? (
              <Link to="/items/customers" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <EmojiPeopleIcon />
                  <Typography>Customer items</Typography>
                </IconButton>
              </Link>
            ) : (
              ''
            )}
            {userIsAdmin() ? (
              <Box>
                <IconButton onClick={handleMenu}>
                  <SupervisorAccountIcon />
                  <Typography>Admin actions</Typography>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <Link to="/users" style={{ textDecoration: 'none' }}>
                      <IconButton onClick={handleClose}>
                        <ListIcon />
                        <Typography>Users</Typography>
                      </IconButton>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/items" style={{ textDecoration: 'none' }}>
                      <IconButton onClick={handleClose}>
                        <ListIcon />
                        <Typography>All items</Typography>
                      </IconButton>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/creditcards" style={{ textDecoration: 'none' }}>
                      <IconButton onClick={handleClose}>
                        <CreditCardIcon />
                        <Typography>All credit cards</Typography>
                      </IconButton>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/bankaccounts" style={{ textDecoration: 'none' }}>
                      <IconButton onClick={handleClose}>
                        <AccountBalanceIcon />
                        <Typography>All bank accounts</Typography>
                      </IconButton>
                    </Link>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              ''
            )}
          </Box>
          {props.user ? (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Link
                to={`/users/${props.user.id}`}
                style={{ textDecoration: 'none' }}
              >
                <IconButton>
                  <AccountCircleIcon />
                  <Typography>Edit profile</Typography>
                </IconButton>
              </Link>
              <Link to="/logout" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <ExitToAppIcon />
                  <Typography>Logout</Typography>
                </IconButton>
              </Link>
              <IconButton onClick={handleDarkMode}>
                {props.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          ) : (
            <Box>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <LockOpenIcon />
                  <Typography>Login</Typography>
                </IconButton>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <PersonAddIcon />
                  <Typography>Register</Typography>
                </IconButton>
              </Link>
              <IconButton onClick={handleDarkMode}>
                {props.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    toggleDarkMode: (toggled) => dispatch(toggleDarkMode(toggled)),
  };
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginHasErrored: state.loginHasErrored,
    isLoading: state.userIsLoading,
    darkMode: state.darkMode,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
