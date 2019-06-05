import {
  createStackNavigator,
  createMaterialTopTabNavigator,
} from "react-navigation";
import {connect} from 'react-redux';
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers';

import DataStoreDemoPage from '../page/DataStoreDemoPage';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
export const rootCom = 'Init'; // root navigator

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
        header: null,
    }
  }
});

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null,
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
    }
  },
  DataStoreDemoPage: {
    screen: DataStoreDemoPage,
    navigationOptions: {
    }
  },
});

export const RootNavigator = createStackNavigator({
  Init: InitNavigator,
  Main: MainNavigator,
}, {
  navigationOptions: {
    header: null,
  }
});

export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,//v2
});

export default connect(mapStateToProps)(AppWithNavigationState);