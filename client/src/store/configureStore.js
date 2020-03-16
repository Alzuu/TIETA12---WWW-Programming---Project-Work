import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import persistState from 'redux-localstorage'

const enhancer = compose(
    applyMiddleware(thunk),
    persistState(/*paths, config*/),
)

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        enhancer,
    );
}