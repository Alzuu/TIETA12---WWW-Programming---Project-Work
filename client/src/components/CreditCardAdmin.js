import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import CreditCard from './CreditCard';

function CreditCardAdmin(props) {
  return <CreditCard id={props.match.params.cardid} admin={true} />;
}

export default CreditCardAdmin;
