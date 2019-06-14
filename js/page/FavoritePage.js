import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, RefreshControl, DeviceEventEmitter, DeviceInfo } from 'react-native';
import {
  createMaterialTopTabNavigator
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';

import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import TrendingItem from "../common/TrendingItem";
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import events from '../event/types';

type Props = {};
class FavoritePage extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title={'Sbuscribe'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;
    const TabNavigator = createMaterialTopTabNavigator({
      'Popular': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme} />,
        navigationOptions: {
          title: 'Popular',
        },
      },
      'Trending': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme} />,
        navigationOptions: {
          title: 'Trending',
        },
      },
    }, {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          style: {
            backgroundColor: theme.themeColor,
            height: 30
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        }
      }
    );
    return <View style={styles.container}>
      {navigationBar}
      <TabNavigator />
    </View>
  }
}

const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapFavoriteStateToProps)(FavoritePage);

class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props);
    const { flag } = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount() {
    this.loadData(true);
    this.bottomTabListener = DeviceEventEmitter.addListener(events.BOTTOM_TAB_SELECT, (data) => {
      if (data.to === 2) {
        this.loadData(false);
      }
    })
  }

  componentWillUnmount() {
    if (this.bottomTabListener) {
      this.bottomTabListener.remove();
    }
  }

  _store() {
    const { favorite } = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
      }
    }
    return store;
  }

  loadData(isShowLoading) {
    const { onLoadFavoriteData } = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading)
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      DeviceEventEmitter.emit(events.FAVORITE_CHANGED_POPULAR);
    } else {
      DeviceEventEmitter.emit(events.FAVORITE_CHANGED_TRENDING);
    }
  }

  renderItem(data) {
    const { theme } = this.props;
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item
      theme={theme}
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: this.storeName,
          callback,
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />
  }

  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item) => "" + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={theme.themeColor}
            />
          }
        />
        <Toast
          ref={'toast'}
          position={'center'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    // minWidth: 50
    padding: 0
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});

const mapStateToProps = state => ({
  favorite: state.favorite
});
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);