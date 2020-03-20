import React from 'react';
import CreditCard from './CreditCard';

function CreditCardAdmin(props) {
  return <CreditCard id={props.match.params.cardid} admin={true} />;
}

export default CreditCardAdmin;
