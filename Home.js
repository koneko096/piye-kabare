'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit Home.js
        </Text>
        <Text style={styles.instructions}>
          For Android:{'\n'}
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu{'\n\n'}
          For iOS:{'\n'}
          Opo yo kok lali -___-
        </Text>
      </View>
    );
  }
}

module.exports = Home;