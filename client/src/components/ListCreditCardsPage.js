import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCreditCards } from '../actions/creditCards';
import './ItemPage.css';

function ListCreditCardsPage(props) {
  useEffect(() => {
    props.getCreditCards(props.token);
  }, []);

  if (props.creditCards) {
    return (
      <div>
        <h2>All credit cards</h2>
        <table className="itemList">
          <thead>
            <th>Card id</th>
            <th>Edit card</th>
          </thead>
          <tbody>
            {props.creditCards.map((card) => (
              <tr key={card._id}>
                <td>{card._id}</td>
                <td>
                  <Link to={`/creditcards/${card._id}`}>Edit card</Link>
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
        <h2>No credit cards.</h2>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  creditCards: state.creditCardsReducer.allCards,
  token: state.user.token,
  userId: state.user.id,
  userRole: state.user.role,
});
const mapDispatchToProps = (dispatch) => {
  return {
    getCreditCards: (token) => dispatch(getCreditCards(token)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCreditCardsPage);
