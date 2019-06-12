import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MORE_MENU } from "../common/MORE_MENU";

type Props = {};
export default class WelcomePage extends Component<Props> {
  componentDidMount() {
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({
        navigation: this.props.navigation
      })
    }, 1000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <Ionicons
          name={MORE_MENU.About.icon}
          size={100}
          style={{
            marginRight: 10,
            color: '#000',
          }}
        />
        <Text style={styles.welcome}> Stay Hungry. Stay Foolish. </Text>
      </View>
    );
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