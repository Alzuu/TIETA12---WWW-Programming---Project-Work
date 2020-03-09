import { combineReducers } from 'redux';
import { user, userHasErrored, userIsLoading } from './users';
import { itemsReducer } from './items';

export default combineReducers({
  user,
  userHasErrored,
  userIsLoading,
  itemsReducer,
});
