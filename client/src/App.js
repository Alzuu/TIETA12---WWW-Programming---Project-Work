import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter } from 'react-router-dom';
import BuyItemPage from './components/BuyItemPage';
import ItemPage from './components/ItemPage';
import ConfirmBuyPage from './components/ConfirmBuyPage';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import RegistrationPage from './components/RegistrationPage';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import AllItemsPage from './components/AllItemsPage';
import CustomerItemsPage from './components/CustomerItemsPage';
import AddItemPage from './components/AddItemPage';
import EditItemPage from './components/EditItemPage';
import DeleteItemPage from './components/DeleteItemPage';
import UserItemsPage from './components/UserItemsPage';
import PaymentInfoPage from './components/PaymentInfoPage';
import ListCreditCardsPage from './components/ListCreditCardsPage';
import CreditCardAdmin from './components/CreditCardAdmin';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/logout" component={LogoutPage} />
          <Route path="/register" component={RegistrationPage} />
          <Route exact path="/users/:id" component={UserPage} />
          <Route exact path="/users/:id/items" component={UserItemsPage} />
          <Route
            exact
            path="/users/:id/payment-info"
            component={PaymentInfoPage}
          />
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
          <Route exact path="/creditcards" component={ListCreditCardsPage} />
          <Route
            exact
            path="/creditcards/:cardid"
            component={CreditCardAdmin}
          />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
