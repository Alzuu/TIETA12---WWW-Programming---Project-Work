export function bankAccountsReducer(state = { bankAccount: '' }, action) {
  switch (action.type) {
    case 'RECEIVED_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    case 'RECEIVED_NEW_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    case 'RECEIVED_DELETED_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    case 'RECEIVED_UPDATED_BANK_ACCOUNT':
      return Object.assign({}, state, {
        bankAccount: action.json,
      });
    default:
      return state;
  }
}
