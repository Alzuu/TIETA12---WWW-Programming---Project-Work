import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter } from 'react-router-dom';
import BuyItemPage from './components/BuyItemPage';
import ItemPage from './components/ItemPage';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import RegistrationPage from './components/RegistrationPage';
import UserPage from './components/UserPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Route exact path="/" component={ItemPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/logout" component={LogoutPage} />
          <Route path="/items/:id/buy" component={BuyItemPage} />
          <Route path="/register" component={RegistrationPage} />
          <Route path="/users/:id" component={UserPage} />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
