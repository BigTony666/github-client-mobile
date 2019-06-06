import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import {
  createMaterialTopTabNavigator
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import actions from '../action/index';
import globalConfig from '../config';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog';
import events from '../event/types';

const THEME_COLOR = '#678';

type Props = {};
export default class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0],
    };
    this.tabNames = ['All', 'C', 'Java', 'Go', 'TypeScript'];
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
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
    if(!this.tabNav) { // enhance performance
      this.tabNav = createMaterialTopTabNavigator(
        this._genTabs(),
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            scrollEnabled: true,
            style: {
              backgroundColor: '#678',
              height: 30
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          }
        }
      );
    }

    return this.tabNav;
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    }

    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    />;

    const TabNavigator = this._tabNav();

    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        {navigationBar}
        <TabNavigator />
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const pageSize = 10;
class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props);
    const { tabLabel, timeSpan } = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
  }

  componentDidMount() {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(events.EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
    });
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
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

  loadData(loadMore) {
    const { onRefreshTrending, onLoadMoreTrending } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
        this.refs.toast.show('No More');
      })
    } else {
      onRefreshTrending(this.storeName, url, pageSize);
    }
  }

  genFetchUrl(key) {
    return globalConfig.GITHUB_TRENDING_URL +
      key + '?' + this.timeSpan.searchText;
  }

  renderItem(data) {
    const item = data.item;
    return <TrendingItem
      projectModel={item}
      onSelect={() => {
        NavigationUtil.goPage({
          projectModel: item,
        }, 'DetailPage')
      }}
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
    const { popular } = this.props;
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item) => "" + item.item.fullName}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
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
  trending: state.trending
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack)),
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);