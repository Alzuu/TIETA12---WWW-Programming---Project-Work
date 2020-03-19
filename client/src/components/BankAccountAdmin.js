import React from 'react';
import BankAccount from './BankAccount';

function BankAccountAdmin(props) {
  return <BankAccount id={props.match.params.bankAccountId} admin={true} />;
}

export default BankAccountAdmin;
