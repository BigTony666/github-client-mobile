import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, DeviceInfo } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import NavigationBar from '../common/NavigationBar';
import globalConfig from '../config';
import NavigationUtil from "../navigator/NavigationUtil";
import ViewUtil from '../util/ViewUtil';
import BackPressComponent from "../common/BackPressComponent";

const THEME_COLOR = '#678';

type Props = {};
export default class DetailPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const { projectModel, flag } = this.params;
    this.url = projectModel.item.html_url || globalConfig.GITHUB_PREFIX_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
    }
    this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });
  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress() {
    this.onBack();
    return true;
  }


  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  renderRightButton() {
    return (<View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={
          () => {
            // this.onFavoriteButtonClick()
          }
        }>
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={20}
          style={{ color: 'white', marginRight: 10 }}
        />
      </TouchableOpacity>
      {ViewUtil.getShareButton(() => {
        // let shareApp = share.share_app;
        // ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, this.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
        //   console.log("result:" + code + message);
        // });
      })}
    </View>
    )
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    })
  }

  render() {
    const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null;
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      titleLayoutStyle={titleLayoutStyle}
      title={this.state.title}
      style={{ backgroundColor: THEME_COLOR }}
      rightButton={this.renderRightButton()}
    />;

    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: this.state.url }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
  },
});