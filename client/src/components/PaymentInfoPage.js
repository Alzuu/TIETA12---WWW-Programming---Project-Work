import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchBankAccount } from '../actions/bankAccounts';
import BankAccount from './BankAccount';

function PaymentInfoPage(props) {
  useEffect(() => {
    props.fetchBankAccount();
  }, []);

  return <BankAccount bankAccount={props.bankAccount} />;
}

const mapStateToProps = (state) => ({
  bankAccount: state.user.bankAccount,
});

const mapDispatchToProps = (dispatch) => {};
