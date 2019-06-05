import {applyMiddleware, createStore} from 'redux';
import reducers from '../reducer';
import {middleware} from '../navigator/AppNavigators';

const middlewares = [
  middleware,
];

export default createStore(reducers, applyMiddleware(...middlewares));