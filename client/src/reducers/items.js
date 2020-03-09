export function itemsReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'RECEIVE_SHOPKEEPER_ITEMS':
      return Object.assign({}, state, {
        items: action.json,
      });
    default:
      return state;
  }
}
