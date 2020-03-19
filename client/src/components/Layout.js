import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Box from '@material-ui/core/Box';

class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <Box>{this.props.children}</Box>
      </>
    );
  }
}

export default Layout;
