import { applyMiddleware, createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import { apiReducer, locationReducer } from './reducers';

const middlewares = [thunk];

if(ENVIRONMENT === 'development') {
    middlewares.push(createLogger());
}

const reducers = {
  form: formReducer,
  api: apiReducer,
  location: locationReducer
};

const reducer = combineReducers(reducers);
export default createStore(reducer, {}, applyMiddleware(...middlewares));
