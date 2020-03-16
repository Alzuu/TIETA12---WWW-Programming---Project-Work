import { combineReducers } from 'redux';
import { user, userLoginHasErrored, userIsLoading } from './usersReducers';
import { itemsReducer } from './items';
import { bankAccountsReducer } from './bankAccounts';

export default combineReducers({
  user,
  userLoginHasErrored,
  userIsLoading,
  itemsReducer,
  bankAccountsReducer,
});
