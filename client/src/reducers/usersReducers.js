export function userLoginHasErrored(state = false, action) {
  switch (action.type) {
    case 'USER_HAS_ERRORED':
      return action.loginHasErrored;
    default:
      return state;
  }
}

export function userIsLoading(state = false, action) {
  switch (action.type) {
    case 'USER_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}

export function user(state = [], action) {
  switch (action.type) {
    case 'USER_FETCH_DATA_SUCCESS':
      console.log(action.user);
      return action.user;
    case 'USER_FETCH_DATA_FAILURE':
      return false;
    case 'USER_HAS_LOGGED_OUT':
      return false;
    default:
      return state;
  }
}
