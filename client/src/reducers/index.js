import { combineReducers } from 'redux';
import { user, userLoginHasErrored, userIsLoading } from './usersReducers';
import { itemsReducer } from './items';

import 'bootstrap/dist/css/bootstrap.min.css';

export default combineReducers({
  user,
  userLoginHasErrored,
  userIsLoading,
  itemsReducer,
});
