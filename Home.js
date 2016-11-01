'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import CookieManager from 'react-native-cookies';

const HOME_URL = "http://piye.kabare/";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loadedCookie: false
    };
  }

  componentWillMount () {
    CookieManager.get(HOME_URL, (cookie) => {
      let isAuthenticated;
      // If it differs, change `cookie.remember_me` to whatever the name for your persistent cookie is!!!
      if (cookie) {
        isAuthenticated = true;
      } else {
        isAuthenticated = false;
      }

      this.setState({
        loggedIn: isAuthenticated,
        loadedCookie: true
      });
    });
  }

  render() {
    return (
      this.state.loggedIn ?
      <Dashboard/> :
      <Login/>
    );
  }
}