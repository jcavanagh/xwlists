import { applyMiddleware, createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

const middlewares = [thunk, promise];

if(ENVIRONMENT === 'development') {
    middlewares.push(createLogger());
}

const reducers = {
  form: formReducer
};

const reducer = combineReducers(reducers);
export default createStore(reducer, applyMiddleware(...middlewares));