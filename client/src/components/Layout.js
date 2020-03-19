import React, { Component } from 'react';
import Navigation from './Navigation';
import Container from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

class Layout extends Component {
  render() {
    return (
      <Container className="rootContainer">
        <Navigation />
        <Paper style={{ margin: 10, paddingBottom: 10 }} square elevation={3}>
          {this.props.children}
        </Paper>
      </Container>
    );
  }
}

export default Layout;
