import React, {Component} from 'react';
import {createBottomTabNavigator} from "react-navigation";
import {StyleSheet, Text, View} from 'react-native';
import PopularPage from './PopularPage';
import MyPage from './MyPage';
import FavoritePage from './FavoritePage';
import TrendingPage from './TrendingPage';

type Props = {};
export default class HomePage extends Component<Props> {
  _tabNavigator() {
    return createBottomTabNavigator({
      PopularPage:{
        screen: PopularPage,
        navigationOptions: {
          tabBarLabel: "Popular",
        }
      },
      TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
          tabBarLabel: "Trending",
        }
      },
      FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
          tabBarLabel: "Favorite",
        }
      },
      MyPage: {
        screen: MyPage,
        navigationOptions: {
          tabBarLabel: "My",
        }
      },
    });
  }

  render() {
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