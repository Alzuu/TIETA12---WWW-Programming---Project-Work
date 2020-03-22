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
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { toggleDarkMode } from '../actions/darkMode';

function Navigation(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const userIsAdmin = () => props.user.role === 1;
  const userIsShopkeeper = () => props.user.role === 2;
  function handleMenu(e) {
    setAnchorEl(e.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
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
            <Link to="/">
              <IconButton>
                <StorefrontIcon />
                <Typography>Items for sale</Typography>
              </IconButton>
            </Link>
            {props.user ? (
              <Box>
                <Link to="/items/add">
                  <IconButton>
                    <AddIcon />
                    <Typography>Add item</Typography>
                  </IconButton>
                </Link>
                <Link to={`/users/${props.user.id}/items`}>
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
              <Link to="/items/customers">
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
                    <Link to="/items">
                      <IconButton onClick={handleClose}>
                        <ListIcon />
                        <Typography>All items</Typography>
                      </IconButton>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/creditcards">
                      <IconButton onClick={handleClose}>
                        <CreditCardIcon />
                        <Typography>All credit cards</Typography>
                      </IconButton>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/bankaccounts">
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
              <Link to={`/users/${props.user.id}`}>
                <IconButton>
                  <AccountCircleIcon />
                  <Typography>Edit profile</Typography>
                </IconButton>
              </Link>
              <Link to="/logout">
                <IconButton>
                  <ExitToAppIcon />
                  <Typography>Logout</Typography>
                </IconButton>
              </Link>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.darkMode}
                    onChange={(e) => {
                      props.toggleDarkMode(e.target.checked);
                    }}
                  />
                }
                label="Dark mode"
              />
            </Box>
          ) : (
            <Box>
              <Link to="/login">
                <IconButton>
                  <LockOpenIcon />
                  <Typography>Login</Typography>
                </IconButton>
              </Link>
              <Link to="/register">
                <IconButton>
                  <PersonAddIcon />
                  <Typography>Register</Typography>
                </IconButton>
              </Link>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.darkMode}
                    onChange={(e) => {
                      props.toggleDarkMode(e.target.checked);
                    }}
                  />
                }
                label="Dark mode"
              />
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
