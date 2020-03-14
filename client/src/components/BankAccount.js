import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addBankAccount,
  deleteBankAccount,
  updateBankAccount,
} from '../actions/bankAccounts';

function BankAccount(props) {
  const [toggle, setToggle] = useState(false);

  return (
    <form encType="application/json" onSubmit={handleSubmit}>
      <label>
        Bank account:
        <input
          type="text"
          name="bankAccount"
          value={props.bankAccount}
          disabled={!toggle}
        />
      </label>
      <label>
        Edit:
        <input
          type="checkbox"
          name="editBankAccount"
          onChange={(e) => setToggle(e.target.checked)}
        />
      </label>
      {/* <input
        type="button"
        name="deleteBankAccount"
        value="Delete"
        onClick={handleDelete}
      /> */}
    </form>
  );
}
export default BankAccount;
