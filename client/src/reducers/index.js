import { combineReducers } from 'redux';
import { user, userLoginHasErrored, userIsLoading } from './usersReducers';
import { itemsReducer } from './items';

export default combineReducers({
  user,
  userLoginHasErrored,
  userIsLoading,
  itemsReducer,
});
