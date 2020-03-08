import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header';

class Layout extends Component {
  render() {
      return (
          <>
              <Header />
              { this.props.children }
          </>
      );
  }
}

export default Layout;