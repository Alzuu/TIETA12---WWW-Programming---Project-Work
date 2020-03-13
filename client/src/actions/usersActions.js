export function userloginHasErrored(bool) {
    return {
        type: 'USER_HAS_ERRORED',
        loginHasErrored: bool,
    };
}

export function userIsLoading(bool) {
    return {
        type: 'USER_IS_LOADING',
        isLoading: bool
    };
}

export function userFetchDataFailure(user) {
    return {
        type: 'USER_FETCH_DATA_FAILURE',
    };
}

export function userFetchDataSuccess(user) {
    return {
        type: 'USER_FETCH_DATA_SUCCESS',
        user
    };
}

export function userFetchData(userName, password) {
    return (dispatch) => {
        dispatch(userIsLoading(true)); 
        
        try {
            fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: userName, password: password}),
        })
        .then(res => res.json())
        .then((user) => {
            if (user === undefined) {
                dispatch(userFetchDataFailure(user));
                dispatch(userloginHasErrored(true));
            } else {
                if (user.auth === true) {
                    dispatch(userFetchDataSuccess(user));
                    dispatch(userloginHasErrored(false));
                } else {
                    dispatch(userFetchDataFailure(user));
                    dispatch(userloginHasErrored(true));
                }
            }
        })
    } catch (error) {
        console.log("error!");
    }
    };
}