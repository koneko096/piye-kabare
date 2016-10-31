'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  View
} from 'react-native';

var Home = require('./Home');
var Example = require('./Example');

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class PiyeKabareApp extends Component {
  constructor(props) { 
    super(props);
    this.navigator = null;
  }

  onBack() {
    if (this.navigator && this.navigator.getCurrentRoutes().length > 1) {
      this.navigator.pop();
      return true;
    }
    return false;
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBack.bind(this));
  }

  navRender(route, navigator) {
    this.navigator = navigator;
    let RouteComponent = route.component;
    return (
      <RouteComponent 
        navigator={navigator}              
        {...route.passProps} />
    );
  }

  render() {
    return (
      <Navigator
        style={styles.container}       
        renderScene={this.navRender.bind(this)}
        initialRoute={{
          title: 'Piye Kabare',
          component: Example
        }}/>
    );
  }
}

AppRegistry.registerComponent('PiyeKabare', () => PiyeKabareApp);
