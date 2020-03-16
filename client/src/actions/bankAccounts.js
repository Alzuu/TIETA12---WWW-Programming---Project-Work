export function receiveBankAccount(json) {
  return {
    type: 'RECEIVE_BANK_ACCOUNT',
    json,
  };
}
export function receiveNewBankAccount(json) {
  return {
    type: 'RECEIVE_NEW_BANK_ACCOUNT',
    json,
  };
}
export function receiveDeletedBankAccount(json) {
  return {
    type: 'RECEIVE_DELETED_BANK_ACCOUNT',
    json,
  };
}
export function receiveUpdatedBankAccount(json) {
  return {
    type: 'RECEIVE_UPDATED_BANK_ACCOUNT',
    json,
  };
}

export function fetchBankAccount(id, token) {
  return (dispatch) => {
    return fetch(`/api/users/${id}`, { headers: { token } })
      .then((res) => res.json())
      .then((json) => {
        const bankAccountId = json.bankAccountId;
        return fetch(`/api/bankaccounts/${bankAccountId}`, {
          headers: { token },
        });
      })
      .then((res) => {
        res.json();
      })
      .then((json) => dispatch(receiveBankAccount(json)))
      .catch((error) => console.log('Request failed', error));
  };
}

export function addBankAccount(details, token) {
  return (dispatch) => {
    return fetch('/api/bankaccounts', {
      method: 'POST',
      headers: { token: token },
      body: details,
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveNewBankAccount(json));
      });
  };
}

export function deleteBankAccount(id, token) {
  return (dispatch) => {
    return fetch(`/api/bankaccounts/${id}`, {
      method: 'DELETE',
      headers: { token: token },
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveDeletedBankAccount(json));
      });
  };
}
export function updateBankAccount(id, details, token) {
  return (dispatch) => {
    return fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(details),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(receiveUpdatedBankAccount(json));
      });
  };
}
