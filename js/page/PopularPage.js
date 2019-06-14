import React, { Component } from 'react';
import { StyleSheet, Text, View, DeviceEventEmitter, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import {
  createMaterialTopTabNavigator
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';

import actions from '../action/index';
import globalConfig from '../config';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import events from '../event/types';
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};
class PopularPage extends Component<Props> {
  constructor(props) {
    super(props);
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }

  _genTabs() {
    const tabs = {};
    const { keys, theme } = this.props;
    keys.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme} />,
        navigationOptions: {
          title: item.name,
        },
      }
    });
    return tabs;
  }

  renderRightButton() {
    const { theme } = this.props;
    return <TouchableOpacity
      onPress={() => {
        // AnalyticsUtil.track("SearchButtonClick");
        NavigationUtil.goPage({ theme }, 'SearchPage')
      }}
    >
      <View style={{ padding: 5, marginRight: 8 }}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white',
          }} />
      </View>
    </TouchableOpacity>
  }

  render() {
    const { keys, theme } = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    }

    let navigationBar = <NavigationBar
      title={'Popular'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;

    const TabNavigator = keys.length ? createMaterialTopTabNavigator(
      this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: theme.themeColor,
            height: 30
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
        lazy: true
      }
    ) : null;

    return (
      <View style={styles.container}>
        {navigationBar}
        {TabNavigator && <TabNavigator />}
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);

const pageSize = 10;
class PopularTab extends Component<Props> {
  constructor(props) {
    super(props);
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();

    this.favoriteChangeListener = DeviceEventEmitter.addListener(events.FAVORITE_CHANGED_POPULAR, () => {
      this.isFavoriteChanged = true;
    });

    this.bottomTabSelectListener = DeviceEventEmitter.addListener(events.BOTTOM_TAB_SELECT, (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }

  componentWillUnmount() {
    if (this.favoriteChangeListener) {
      this.favoriteChangeListener.remove();
    }
    if (this.bottomTabSelectListener) {
      this.bottomTabSelectListener.remove();
    }
  }

  _store() {
    const { popular } = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // data that will be show
        hideLoadingMore: true, // default to hide load more
      }
    }
    return store;
  }

  loadData(loadMore, refreshFavorite) {
    const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('No More');
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }
  }

  genFetchUrl(key) {
    return globalConfig.GITHUB_SEARCH_REPOSITORY_URL +
      key +
      globalConfig.GITHUB_SEARCH_REPOSITORY_QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    const { theme } = this.props;
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback,
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />
  }

  genIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>Loading More</Text>
      </View>
  }

  render() {
    let store = this._store();
    const { theme } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item) => "" + item.item.id}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) { // https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 200);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
            console.log('---onMomentumScrollBegin-----')
          }}
        />
        <Toast
          ref={'toast'}
          position={'center'}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  popular: state.popular
});
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

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