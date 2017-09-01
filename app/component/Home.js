// 'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

if (!window.location) {
    // App is running in simulator
    window.navigator.userAgent = 'ReactNative';
}

const io = require('socket.io-client');

import Dashboard from './Dashboard';
import Login from './Login';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
    
    this.socket = io('http://192.168.1.15:8083', { 
      jsonp: false,
      transports: ['websocket'],
      // autoConnect: true
    });
  }

  justLoggedIn(userData) {
    this.setState({ userData: userData, loggedIn: true });
  }

  render() {
    return (
      this.state.loggedIn ?
      <Dashboard
        socket={this.socket}
        navigator={this.props.navigator}
        userData={this.state.userData}/> :
      <Login 
        socket={this.socket}
        navigator={this.props.navigator}
        justLoggedIn={this.justLoggedIn.bind(this)}/>
    );
  }
}