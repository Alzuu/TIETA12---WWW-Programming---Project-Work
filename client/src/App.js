import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter } from 'react-router-dom';
import ItemPage from './components/ItemPage';
import BuyItemPage from './components/BuyItemPage';
import ConfirmBuyPage from './components/ConfirmBuyPage';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import AllItemsPage from './components/AllItemsPage';
import CustomerItemsPage from './components/CustomerItemsPage';
import AddItemPage from './components/AddItemPage';
import EditItemPage from './components/EditItemPage';
import DeleteItemPage from './components/DeleteItemPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Route exact path="/" component={ItemPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegistrationPage} />
          <Route exact path="/items" component={AllItemsPage} />
          <Route exact path="/items/customers" component={CustomerItemsPage} />
          <Route exact path="/items/:id/buy" component={BuyItemPage} />
          <Route
            exact
            path="/items/:id/buy/confirm"
            component={ConfirmBuyPage}
          />
          <Route exact path="/items/add" component={AddItemPage} />
          <Route exact path="/items/:id/edit" component={EditItemPage} />
          <Route exact path="/items/:id/delete" component={DeleteItemPage} />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
