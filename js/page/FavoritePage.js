import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import actions from '../action/index';
import {connect} from 'react-redux';

type Props = {};
class FavoritePage extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}> FavoritePage </Text>
        <Button
          title="Change Theme Color"
          onPress={() => {
            this.props.onThemeChange('#206')
          }}
        />
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

const mapStateToProps = state => ({
  
});

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);