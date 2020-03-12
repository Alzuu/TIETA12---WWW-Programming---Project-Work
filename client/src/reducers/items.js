export function itemsReducer(state = { items: [], customerItems: [] }, action) {
  switch (action.type) {
    case 'RECEIVE_SHOPKEEPER_ITEMS':
      return Object.assign({}, state, {
        items: action.json,
      });
    case 'RECEIVE_CUSTOMER_ITEMS':
      return Object.assign({}, state, {
        customerItems: action.json,
      });
    case 'RECEIVE_ALL_ITEMS':
      return Object.assign({}, state, { allItems: action.json });
    case 'RECEIVE_ITEM':
      return Object.assign({}, state, { item: action.json });
    case 'RECEIVE_NEW_ITEM':
      return Object.assign({}, state, { newItem: action.json });
    case 'CONFIRM_PURCHASE':
      return Object.assign({}, state, { item: action.json });
    default:
      return state;
  }
}
