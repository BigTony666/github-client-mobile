import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { createBottomTabNavigator } from "react-navigation";
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabBar } from 'react-navigation-tabs';

import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import SearchPage from '../page/SearchPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import events from '../event/types';

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
  // TrendingPage: {
  //   screen: TrendingPage,
  //   navigationOptions: {
  //     tabBarLabel: "Trending",
  //     tabBarIcon: ({ tintColor, focused }) => (
  //       <MaterialIcons
  //         name={'trending-up'}
  //         size={26}
  //         style={{ color: tintColor }}
  //       />
  //     ),
  //   }
  // },
  SearchPage: {
    screen: SearchPage,
    navigationOptions: {
      tabBarLabel: "Trending",
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={'ios-search'}
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

class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }

  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const { PopularPage, SearchPage, FavoritePage, MyPage } = TABS;
    const tabs = { PopularPage, SearchPage, FavoritePage, MyPage };
    PopularPage.navigationOptions.tabBarLabel = 'Popular';
    return this.Tabs = createBottomTabNavigator(
      tabs,
      {
        tabBarComponent: props => {
          return <TabBarComponent theme={this.props.theme} {...props} />
        },
        tabBarOptions: {
          showLabel: false,
        }
      });
  }

  render() {
    const Tab = this._tabNavigator();
    return <Tab
      onNavigationStateChange={(prevState, newState, action) => {
        DeviceEventEmitter.emit(events.BOTTOM_TAB_SELECT, {
          from: prevState.index,
          to: newState.index
        })
      }}
    />
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
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme.themeColor}
    />
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);