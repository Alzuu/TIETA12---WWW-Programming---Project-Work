export function userFetchHasErrored(bool) {
  return {
    type: 'USER_HAS_ERRORED',
    loginHasErrored: bool,
  };
}

export function userIsLoading(bool) {
  return {
    type: 'USER_IS_LOADING',
    isLoading: bool,
  };
}

export function userFetchDataFailure(user) {
  return {
    type: 'USER_FETCH_DATA_FAILURE',
  };
}

export function userFetchDataSuccess(user) {
  console.log('USER_FETCH_DATA_SUCCESS o/');
  console.log(user);
  return {
    type: 'USER_FETCH_DATA_SUCCESS',
    user,
  };
}

export function userHasLoggedOut() {
  return {
    type: 'USER_HAS_LOGGED_OUT',
  };
}

export function userFetchData(userName, password) {
  console.log('userFetchData o/');
  return (dispatch) => {
    dispatch(userIsLoading(true));

    try {
      fetch('/api/users/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName, password: password }),
      })
        .then((res) => res.json())
        .then((user) => {
          if (user === undefined) {
            dispatch(userFetchDataFailure(user));
            dispatch(userFetchHasErrored(true));
          } else {
            if (user.auth === true) {
              dispatch(userFetchDataSuccess(user));
              dispatch(userFetchHasErrored(false));
              dispatch(userIsLoading(false));
            } else {
              dispatch(userFetchDataFailure(user));
              dispatch(userFetchHasErrored(true));
            }
          }
        });
    } catch (error) {
      console.log('error!');
    }
  };
}

export function userDelete(user) {
  console.log('userDeete o/');
  console.log(user);
  
  return (dispatch) => {
    dispatch(userIsLoading(true));

      return fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          token: user.token,
        },
      })
      .then((res) => res.json())
        .then((json) => {
          // Update state with new item¨
          console.log("user delete action OK o/");
          dispatch(userHasLoggedOut(true));
        });
  };
}

export function userModify(user) {
  console.log('userModify o/');
  console.log(user);
  return (dispatch) => {
    dispatch(userIsLoading(true));

    try {
      fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: user.token,
        },
        body: JSON.stringify({
          name: user.name,
          password: user.password,
          role: user.role,
        }),
      })
        .then((res) => res.json())
        .then((user) => {
          if (user === undefined) {
            dispatch(userFetchDataFailure(user));
            dispatch(userFetchHasErrored(true));
          } else {
            if (user.auth === true) {
              dispatch(userFetchDataSuccess(user));
              dispatch(userFetchHasErrored(false));
              dispatch(userIsLoading(false));
            } else {
              dispatch(userFetchDataFailure(user));
              dispatch(userFetchHasErrored(true));
            }
          }
        });
    } catch (error) {
      console.log('error!');
    }
  };
}

export function userAdd(user) {
  console.log('userAdd o/');
  console.log(user);
  return (dispatch) => {
    dispatch(userIsLoading(true));

    try {
      fetch('api/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          role: user.role,
          password: user.password,
          creditCardId: '123',
          bankAccountId: '456',
        }),
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('error!');
    }
  };
}

export function userLogout() {
  return (dispatch) => {
    dispatch(userHasLoggedOut(true));
  };
}
