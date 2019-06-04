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
import DynamicTabNavigator from "../navigator/DynamicTabNavigator"
type Props = {};
export default class HomePage extends Component<Props> {

  render() {
    NavigationUtil.navigation = this.props.navigation;
    return <DynamicTabNavigator></DynamicTabNavigator>
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