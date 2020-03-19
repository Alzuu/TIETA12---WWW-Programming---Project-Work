import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchBankAccounts } from '../actions/bankAccounts';
import './ItemPage.css';

function ListBankAccountsPage(props) {
  useEffect(() => {
    props.fetchBankAccounts(props.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (props.bankAccounts) {
    return (
      <div>
        <h2>All bank accounts</h2>
        <table className="itemList">
          <thead>
            <th>Bank account ID</th>
            <th>Edit bank account</th>
          </thead>
          <tbody>
            {props.bankAccounts.map((bankAccount) => (
              <tr key={bankAccount._id}>
                <td>{bankAccount._id}</td>
                <td>
                  <Link to={`/bankaccounts/${bankAccount._id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <h2>No bank accounts.</h2>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  bankAccounts: state.bankAccountsReducer.allBankAccounts,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    fetchBankAccounts: (token) => dispatch(fetchBankAccounts(token)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListBankAccountsPage);
