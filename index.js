/**
 * @format
 */

import {AppRegistry} from 'react-native';
import AppNavigator from './js/navigator/AppNavigators'
import WelcomePage from './js/page/WelcomePage';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppNavigator);
