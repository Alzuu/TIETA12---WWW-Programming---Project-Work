export function bankAccountsReducer(state = { bankAccount: '' }, action) {
  switch (action.type) {
    case 'RECEIVE_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    case 'RECEIVE_NEW_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    case 'RECEIVE_DELETED_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    case 'RECEIVE_UPDATED_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    default:
      return state;
  }
}
