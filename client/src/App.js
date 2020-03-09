import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';

function App() { 
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegistrationPage} />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
