import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import {
  createMaterialTopTabNavigator
} from 'react-navigation';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action/index';
import globalConfig from '../config';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog';
import events from '../event/types';
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

type Props = {};
class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0],
    };
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys = [];
  }

  _genTabs() {
    const tabs = {};
    const { keys, theme } = this.props;
    this.preKeys = keys;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme} />,
          navigationOptions: {
            title: item.name,
          },
        }
      }
    });
    return tabs;
  }

  renderTitleView() {
    return <View>
      <TouchableOpacity
        underlayColor='transparent'
        onPress={() => this.dialog.show()}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: '400'
          }}>Trending {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{ color: 'white' }}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    });
    DeviceEventEmitter.emit(events.EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }

  renderTrendingDialog() {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
    />
  }

  _tabNav() {
    const { theme } = this.props;
    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) { // enhance performance
      this.tabNav = createMaterialTopTabNavigator(
        this._genTabs(),
        {
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
      );
    }

    return this.tabNav;
  }

  render() {
    const { keys, theme } = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;

    const TabNavigator = keys.length ? this._tabNav() : null;

    return (
      <View style={styles.container}>
        {navigationBar}
        {TabNavigator && <TabNavigator />}
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const mapTrendingStateToProps = state => ({
  keys: state.language.languages,
  theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);

const pageSize = 10;
class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props);
    const { tabLabel, timeSpan } = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();

    this.timeSpanChangeListener = DeviceEventEmitter.addListener(events.EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
    });

    this.favoriteChangeListener = DeviceEventEmitter.addListener(events.FAVORITE_CHANGED_TRENDING, () => {
      this.isFavoriteChanged = true;
    });

    this.bottomTabSelectListener = DeviceEventEmitter.addListener(events.BOTTOM_TAB_SELECT, (data) => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }

    if (this.favoriteChangeListener) {
      this.favoriteChangeListener.remove();
    }

    if (this.bottomTabSelectListener) {
      this.bottomTabSelectListener.remove();
    }
  }

  _store() {
    const { trending } = this.props;
    let store = trending[this.storeName];
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
    const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('No More');
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
      this.isFavoriteChanged = false;
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
    }
  }

  genFetchUrl(key) {
    return globalConfig.GITHUB_TRENDING_URL +
      key + '?' + this.timeSpan.searchText;
  }

  renderItem(data) {
    const item = data.item;
    const { theme } = this.props;
    return <TrendingItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback,
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
          keyExtractor={(item) => "" + item.item.fullName}
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
  trending: state.trending
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

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