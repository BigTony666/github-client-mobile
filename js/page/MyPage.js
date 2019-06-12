import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MORE_MENU } from "../common/MORE_MENU";
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import actions from "../action";
import NavigationBar from '../common/NavigationBar';

type Props = {};
class MyPage extends Component<Props> {
  onClick(menu) {
    const { theme } = this.props;
    let RouteName, params = { theme };
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = 'RN Tutorial';
        params.url = 'https://facebook.github.io/react-native/docs/tutorial';
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;
      case MORE_MENU.Custom_Theme:
        const { onShowCustomThemeView } = this.props;
        onShowCustomThemeView(true);
        break;
      case MORE_MENU.CodePush:
        RouteName = 'CodePushPage';
        break;
      case MORE_MENU.Sort_Key:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage';
        RouteName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }

  getItem(menu) {
    const { theme } = this.props;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
  }


  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar =
      <NavigationBar
        title={'My'}
        statusBar={statusBar}
        style={theme.styles.navBar}
      />;
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: theme.themeColor,
                }}
              />
              <Text>GitHub Popular</Text>
            </View>
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {/* {this.getItem(MORE_MENU.Tutorial)} */}
          {/*Trending Management*/}
          <Text style={styles.groupTitle}>Trening Management</Text>
          {/*Custom Language*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*Language Sort*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*Popular Management*/}
          <Text style={styles.groupTitle}>Popular Management</Text>
          {/*Custom Tags*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*Tags Sort*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*Tags Remove*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*Configuration*/}
          <Text style={styles.groupTitle}>Configuration</Text>
          {/*Custom Theme*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line} />
          {/*Feedback*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});