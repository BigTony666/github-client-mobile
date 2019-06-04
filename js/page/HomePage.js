import React, {Component} from 'react';
import {createBottomTabNavigator} from "react-navigation";
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PopularPage from './PopularPage';
import MyPage from './MyPage';
import FavoritePage from './FavoritePage';
import TrendingPage from './TrendingPage';
import NavigationUtil from '../navigator/NavigationUtil';

type Props = {};
export default class HomePage extends Component<Props> {
  _tabNavigator() {
    return createBottomTabNavigator({
      PopularPage:{
        screen: PopularPage,
        navigationOptions: {
          tabBarLabel: "Popular",
          tabBarIcon: ({tintColor, focused}) => (
            <FontAwesome5
              name={'hotjar'}
              size={26}
              style={{color: tintColor}}
            />
          ),
        }
      },
      TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
          tabBarLabel: "Trending",
          tabBarIcon: ({tintColor, focused}) => (
            <MaterialIcons
              name={'trending-up'}
              size={26}
              style={{color: tintColor}}
            />
          ),
        }
      },
      FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
          tabBarLabel: "Favorite",
          tabBarIcon: ({tintColor, focused}) => (
            <MaterialIcons
              name={'favorite'}
              size={26}
              style={{color: tintColor}}
            />
          ),
        }
      },
      MyPage: {
        screen: MyPage,
        navigationOptions: {
          tabBarLabel: "My",
          tabBarIcon: ({tintColor, focused}) => (
            <FontAwesome5
              name={'user-alt'}
              size={26}
              style={{color: tintColor}}
            />
          ),
        }
      },
    });
  }

  render() {
    NavigationUtil.navigation = this.props.navigation;
    const Tab = this._tabNavigator();
    return <Tab></Tab>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});