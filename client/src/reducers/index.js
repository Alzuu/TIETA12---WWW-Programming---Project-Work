import { combineReducers } from 'redux';
import { user, userLoginHasErrored, userIsLoading } from './usersReducers';
import { itemsReducer } from './items';
import { bankAccountsReducer } from './bankAccounts';
import { creditCardsReducer } from './creditCards';
import { darkMode } from './darkMode';

export default combineReducers({
  user,
  userLoginHasErrored,
  userIsLoading,
  itemsReducer,
  bankAccountsReducer,
  creditCardsReducer,
  darkMode,
});
