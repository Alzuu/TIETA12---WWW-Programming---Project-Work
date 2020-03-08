import { combineReducers } from 'redux';
import { user, userHasErrored, userIsLoading } from './users';export default combineReducers({
    user,
    userHasErrored,
    userIsLoading
});