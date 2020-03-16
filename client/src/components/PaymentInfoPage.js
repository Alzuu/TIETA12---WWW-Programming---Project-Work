import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchBankAccount } from '../actions/bankAccounts';
import BankAccount from './BankAccount';

function PaymentInfoPage(props) {
  function fetchBA(userId, token) {
    props.fetchBankAccount(userId, token);
  }
  useEffect(() => {
    fetchBA(props.userId, props.token);
  }, []);

  return (
    <BankAccount
      bankAccount={props.bankAccount}
      userId={props.userId}
      userRole={props.userRole}
    />
  );
}

const mapStateToProps = (state) => ({
  bankAccount: state.bankAccountsReducer.bankAccount,
  token: state.user.token,
  userId: state.user.userId,
  userRole: state.user.userRole,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBankAccount: (userId, token) =>
      dispatch(fetchBankAccount(userId, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfoPage);
