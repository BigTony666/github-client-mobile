import React, { Component } from 'react';
import {createBottomTabNavigator} from "react-navigation";
import NavigationUtil from '../navigator/NavigationUtil';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BottomTabBar} from 'react-navigation-tabs';

type Props = {};

const TABS = {
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: "Popular",
      tabBarIcon: ({ tintColor, focused }) => (
        <FontAwesome5
          name={'hotjar'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: "Trending",
      tabBarIcon: ({ tintColor, focused }) => (
        <MaterialIcons
          name={'trending-up'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: "Favorite",
      tabBarIcon: ({ tintColor, focused }) => (
        <MaterialIcons
          name={'favorite'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: "My",
      tabBarIcon: ({ tintColor, focused }) => (
        <FontAwesome5
          name={'user-alt'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    }
  },
};

export default class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }

  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
    const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
    PopularPage.navigationOptions.tabBarLabel = 'Popular';
    return createBottomTabNavigator(
      tabs,
    {
      tabBarComponent: TabBarComponent,
    });
  }

  render() {
    NavigationUtil.navigation = this.props.navigation;
    const Tab = this._tabNavigator();
    return <Tab/>
  }
}

class TabBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime(),
    }
  }

  render() {
    const {routes, index} = this.props.navigation.state;
    if(routes[index].params) {
      const {theme} = routes[index].params;
      if(theme && theme.updateTime > this.theme.updateTime) {
        this.theme = theme;
      }
    }
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.theme.tintColor || this.props.activeTintColor}
    />
  }
}


