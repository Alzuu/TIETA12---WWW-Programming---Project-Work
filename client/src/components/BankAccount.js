import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addBankAccount,
  deleteBankAccount,
  updateBankAccount,
} from '../actions/bankAccounts';

function BankAccount(props) {
  return (
    <>
      <h2>Bank account: {props.bankAccount.number}</h2>
      <h2>Balance: {props.bankAccount.balance}</h2>
    </>
  );
}
export default BankAccount;
