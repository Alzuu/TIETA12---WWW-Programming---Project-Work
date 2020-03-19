export function bankAccountsReducer(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_BANK_ACCOUNT':
      return Object.assign({}, state, {
        message: action.json.message ? action.json.message : null,
        id: action.json._id,
        number: action.json.number,
        balance: action.json.balance,
      });
    case 'RECEIVE_BANK_ACCOUNTS':
      return Object.assign({}, state, {
        allBankAccounts: action.json,
      });
    case 'BANK_ACCOUNT_DELETED':
      return Object.assign({}, { allBankAccounts: state.allBankAccounts });
    case 'BANK_ACCOUNT_CLEARED':
      return {
        number: undefined,
        balance: undefined,
        message: undefined,
      };
    default:
      return state;
  }
}
