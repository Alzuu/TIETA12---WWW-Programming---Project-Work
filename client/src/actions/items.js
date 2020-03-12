export function receiveShopkeeperItems(json) {
  return {
    type: 'RECEIVE_SHOPKEEPER_ITEMS',
    json,
  };
}
export function receiveCustomerItems(json) {
  return {
    type: 'RECEIVE_CUSTOMER_ITEMS',
    json,
  };
}
export function receiveAllItems(json) {
  return {
    type: 'RECEIVE_ALL_ITEMS',
    json,
  };
}
export function receiveItem(json) {
  return {
    type: 'RECEIVE_ITEM',
    json,
  };
}
export function receiveNewItem(json) {
  return {
    type: 'RECEIVE_NEW_ITEM',
    json,
  };
}
export function confirmPurchase(json) {
  return {
    type: 'CONFIRM_PURCHASE',
    json,
  };
}
export function fetchShopkeeperItems() {
  return (dispatch) => {
    return fetch('/api/items/shopkeepers')
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveShopkeeperItems(json));
      });
  };
}
export function fetchCustomerItems(token) {
  return (dispatch) => {
    return fetch('/api/items/customers', { headers: { token: token } })
      .then((res) => {
        const resJson = res.json();

        return resJson;
      })
      .then((json) => {
        dispatch(receiveCustomerItems(json));
      });
  };
}
export function fetchAllItems(token) {
  return (dispatch) => {
    return fetch('/api/items', { headers: { token: token } })
      .then((res) => {
        const resJson = res.json();

        return resJson;
      })
      .then((json) => {
        dispatch(receiveAllItems(json));
      });
  };
}
export function fetchItem(id, token) {
  return (dispatch) => {
    return fetch(`/api/items/${id}`, { headers: { token: token } })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(receiveItem(json));
      });
  };
}
export function buyItem(id, token, userId) {
  return (dispatch) => {
    return fetch(`/api/items/${id}/sell/${userId}`, {
      method: 'PUT',
      headers: { token: token },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(confirmPurchase(json));
      });
  };
}
export function addItem(item, token) {
  return (dispatch) => {
    return fetch('/api/items', {
      method: 'POST',
      headers: { token: token },
      body: item,
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveNewItem(json));
      });
  };
}
