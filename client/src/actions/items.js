export function receiveShopkeeperItems(json) {
  return {
    type: 'RECEIVE_SHOPKEEPER_ITEMS',
    json,
  };
}
export function fetchShopkeeperItems() {
  return (dispatch) => {
    return fetch('/api/items/shopkeepers')
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(receiveShopkeeperItems(json));
      });
  };
}
