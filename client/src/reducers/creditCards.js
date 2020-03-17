export function creditCardsReducer(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_CREDITCARD':
      return Object.assign({}, state, {
        message: action.json.message ? action.json.message : null,
        id: action.json._id,
        number: action.json.number,
        cvc: action.json.CVC,
        ownerName: action.json.ownerName,
      });
    case 'RECEIVE_CREDITCARDS':
      return Object.assign({}, state, {
        allCards: action.json,
      });
    case 'DELETE_CREDITCARD':
      return Object.assign({}, { allCards: state.allCards });
    case 'CARDS_CLEARED':
      return {
        number: undefined,
        id: undefined,
        message: undefined,
        cvc: undefined,
        ownerName: undefined,
      };
    default:
      return state;
  }
}
