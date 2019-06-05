import {combineReducers} from 'redux';
import themeReducer from './theme';
import popularReducer from './popular';
import {rootCom, RootNavigator} from '../navigator/AppNavigators';

const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

const index = combineReducers({
  nav: navReducer,
  theme: themeReducer,
  popular: popularReducer,
});

export default index;