import React, { Component } from 'react';
import { NavigationActions } from "react-navigation";
import { connect } from 'react-redux';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import BackPressComponent from "../common/BackPressComponent";
import actions from "../action";
import CustomTheme from '../page/CustomTheme';
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";


type Props = {};
class HomePage extends Component<Props> {

  constructor(props) {
    super(props);
    this.backPress = new BackPressComponent({ backPress: this.onBackPress });
  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.routes[1].index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  renderCustomThemeView() {
    const { customThemeViewVisible, onShowCustomThemeView } = this.props;
    return (<CustomTheme
      visible={customThemeViewVisible}
      {...this.props}
      onClose={() => onShowCustomThemeView(false)}
    />)
  }

  render() {
    const { theme } = this.props;
    NavigationUtil.navigation = this.props.navigation;
    return <SafeAreaViewPlus
      topColor={theme.themeColor}
    >
      <DynamicTabNavigator />
      {this.renderCustomThemeView()}
    </SafeAreaViewPlus>;
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible,
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);