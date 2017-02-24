import { applyMiddleware, createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createLogger from 'redux-logger';
import { reducer as reduxAsyncConnect } from 'redux-connect';

const middlewares = [];

if(ENVIRONMENT === 'development') {
    middlewares.push(createLogger());
}

const reducers = {
  form: formReducer,
  reduxAsyncConnect
};

const reducer = combineReducers(reducers);
export default createStore(reducer, applyMiddleware.apply(null, middlewares));