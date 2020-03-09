import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter } from 'react-router-dom';
import ItemPage from './components/ItemPage';
import BuyItemPage from './components/BuyItemPage';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Route exact path="/" component={ItemPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegistrationPage} />
          <Route path="/items/:id/buy" component={BuyItemPage} />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
