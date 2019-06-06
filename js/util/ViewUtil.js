import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {
  static getLeftBackButton(cb) {
    return <TouchableOpacity
      style={{ padding: 8, paddingLeft: 12 }}
      onPress={cb}>
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{ color: 'white' }} />
    </TouchableOpacity>
  }

  static getRightButton(title, callBack) {
    return <TouchableOpacity
      style={{ alignItems: 'center', }}
      onPress={callBack}>
      <Text style={{ fontSize: 20, color: '#FFFFFF', marginRight: 10 }}>{title}</Text>
    </TouchableOpacity>
  }

  static getShareButton(callBack) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callBack}
    >
      <Ionicons
        name={'md-share'}
        size={20}
        style={{ opacity: 0.9, marginRight: 10, color: 'white' }} />
    </TouchableOpacity>
  }
}