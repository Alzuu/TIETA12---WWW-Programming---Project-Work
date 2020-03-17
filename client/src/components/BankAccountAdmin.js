import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import BankAccount from './BankAccount';

function BankAccountAdmin(props) {
  return <BankAccount id={props.match.params.bankAccountId} admin={true} />;
}

export default BankAccountAdmin;
