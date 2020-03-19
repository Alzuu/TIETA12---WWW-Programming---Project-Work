export function receiveBankAccountId(json) {
  return {
    type: 'USER_FETCH_DATA_SUCCESS',
    user: json,
  };
}

export function receiveBankAccount(json) {
  return {
    type: 'RECEIVE_BANK_ACCOUNT',
    json,
  };
}

export function receiveBankAccounts(json) {
  return {
    type: 'RECEIVE_BANK_ACCOUNTS',
    json,
  };
}

export function bankAccountDeleted() {
  return {
    type: 'BANK_ACCOUNT_DELETED',
  };
}

export function bankAccountCleared() {
  return {
    type: 'BANK_ACCOUNT_CLEARED',
  };
}

export function clearBankAccount() {
  return (dispatch) => dispatch(bankAccountCleared());
}

export function fetchBankAccount(id, token) {
  return (dispatch) => {
    fetch(`/api/bankaccounts/${id}`, {
      headers: { token },
    })
      .then((response) => response.json())
      .then((json) => dispatch(receiveBankAccount(json)))
      .catch((error) => console.log('Request failed', error));
  };
}

export function fetchBankAccounts(token) {
  return (dispatch) => {
    return fetch('/api/bankaccounts', { headers: { token: token } })
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveBankAccounts(json));
      });
  };
}

export function addBankAccount(details, token, user) {
  return (dispatch) => {
    return fetch('/api/bankaccounts', {
      method: 'POST',
      headers: { token: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    })
      .then((res) => res.json())
      .then((json) => {
        fetch(`/api/users/${user.userId}`, {
          method: 'PUT',
          headers: { token: token, 'Content-Type': 'application/json' },
          body: JSON.stringify(
            Object.assign(
              {},
              {
                name: user.userName,
                role: user.userRole,
                bankAccountId: json._id,
                creditCardId: user.creditCardId,
              }
            )
          ),
        })
          .then((response) => response.json())
          .then((jsonUser) => {
            const modUser = {
              auth: true,
              bankAccountId: jsonUser.bankAccountId,
              creditCardId: jsonUser.creditCardId,
              token: token,
              id: jsonUser.id,
              name: jsonUser.name,
              role: jsonUser.role,
            };
            if (jsonUser.bankAccountId !== undefined) {
              dispatch(receiveBankAccountId(modUser));
            }
          });
      });
  };
}

export function deleteBankAccount(id, token, user) {
  return (dispatch) => {
    return fetch(`/api/bankaccounts/${id}`, {
      method: 'DELETE',
      headers: { token: token },
    })
      .then((res) => res.json())
      .then((json) => {
        fetch(`/api/users/${user.userId}`, {
          method: 'PUT',
          headers: { token: token, 'Content-Type': 'application/json' },
          body: JSON.stringify(
            Object.assign(
              {},
              {
                name: user.userName,
                role: user.userRole,
                bankAccountId: undefined,
                creditCardId: user.creditCardId,
              }
            )
          ),
        })
          .then((response) => response.json())
          .then((jsonUser) => {
            const modUser = {
              auth: true,
              bankAccountId: undefined,
              creditCardId: jsonUser.creditCardId,
              token: token,
              id: jsonUser.id,
              name: jsonUser.name,
              role: jsonUser.role,
            };
            if (jsonUser.bankAccountId !== undefined) {
              dispatch(receiveBankAccountId(modUser));
              dispatch(bankAccountDeleted());
            }
          });
      });
  };
}

export function updateBankAccount(id, details, token) {
  return (dispatch) => {
    return fetch(`/api/bankaccounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(details),
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveBankAccount(json));
      });
  };
}
