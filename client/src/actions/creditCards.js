export function receiveCreditCardId(json) {
  return {
    type: 'USER_FETCH_DATA_SUCCESS',
    user: json,
  };
}
export function receiveCreditCard(json) {
  return {
    type: 'RECEIVE_CREDITCARD',
    json,
  };
}
export function receiveCreditCards(json) {
  return {
    type: 'RECEIVE_CREDITCARDS',
    json,
  };
}
export function creditCardDeleted() {
  return {
    type: 'DELETE_CREDITCARD',
  };
}
export function cardsCleared() {
  return {
    type: 'CARDS_CLEARED',
  };
}
export function clearCreditCard() {
  return (dispatch) => {
    dispatch(cardsCleared());
  };
}
export function addCreditCard(form, token, user) {
  return (dispatch) => {
    // Add credit card to database
    return fetch('/api/creditcards', {
      method: 'POST',
      headers: { token: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((json) => {
        // Add credit card id to user
        fetch(`/api/users/${user.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', token: token },
          body: JSON.stringify(
            Object.assign(
              {},
              {
                name: user.userName,
                role: user.userRole,
                bankAccountId: user.bankAccountId,
                creditCardId: json._id,
              }
            )
          ),
        })
          .then((response) => response.json())
          .then((jsonuser) => {
            const modUser = {
              auth: true,
              bankAccountId: jsonuser.bankAccountId,
              creditCardId: jsonuser.creditCardId,
              token: token,
              id: jsonuser.id,
              name: jsonuser.name,
              role: jsonuser.role,
            };
            if (jsonuser.creditCardId !== undefined) {
              // Update state with new user information
              dispatch(receiveCreditCardId(modUser));
            }
          });
      });
  };
}
export function editCreditCard(form, token, id) {
  return (dispatch) => {
    // Update credit card to database
    return fetch(`/api/creditcards/${id}`, {
      method: 'PUT',
      headers: { token: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((json) => {
        // Update state with new credit card information
        dispatch(receiveCreditCard(json));
      });
  };
}
export function getCreditCard(id, token) {
  return (dispatch) => {
    // Get credit card from database
    return fetch(`/api/creditcards/${id}`, { headers: { token: token } })
      .then((res) => res.json())
      .then((json) => {
        // Update state with new credit card information
        dispatch(receiveCreditCard(json));
      });
  };
}
export function getCreditCards(token) {
  return (dispatch) => {
    // Get credit cards from database
    return fetch('/api/creditcards', { headers: { token: token } })
      .then((res) => res.json())
      .then((json) => {
        // Update state with list of all credit cards
        dispatch(receiveCreditCards(json));
      });
  };
}
export function deleteCreditCard(id, token, user) {
  // Delete credit card from database
  return (dispatch) => {
    return fetch(`/api/creditcards/${id}`, {
      method: 'DELETE',
      headers: { token: token },
    })
      .then((res) => res.json())
      .then((json) => {
        // Update user credit card id
        fetch(`/api/users/${user.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', token: token },
          body: JSON.stringify(
            Object.assign(
              {},
              {
                name: user.userName,
                role: user.userRole,
                bankAccountId: user.bankAccountId,
                creditCardId: undefined,
              }
            )
          ),
        })
          .then((response) => response.json())
          .then((jsonuser) => {
            const modUser = {
              auth: true,
              bankAccountId: jsonuser.bankAccountId,
              creditCardId: undefined,
              token: token,
              id: jsonuser.id,
              name: jsonuser.name,
              role: jsonuser.role,
            };
            if (jsonuser.creditCardId !== undefined) {
              // delete credit card from state and update user credit card id
              dispatch(receiveCreditCardId(modUser));
              dispatch(creditCardDeleted());
            }
          });
      });
  };
}
