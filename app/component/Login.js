'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import Register from './Register';

import styles from '../style/FormStyles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      pass: '',
      loggedIn: this.props.loggedIn,
      isLoading: false,
      message: ''
    };
  }

  onLogin() {
    // var socket = this.props.socket;
    // socket.emit('login', {uname: this.state.uname, pass: this.state.pass});
    this.setState({ isLoading: true, loggedIn: true });
    // socket.on('login_status', function (userData) {
    //   this.setState({ message: JSON.stringify(userData) });
    // });
  }

  justLoggedIn() {
    this.setState({ loggedIn: true });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loggedIn)
      this.props.justLoggedIn();
  }

  onRegister() {
    this.props.navigator.push({
      title: 'Register',
      component: Register,
      passProps: {justLoggedIn: this.justLoggedIn.bind(this)}
    });
  }

  onUsernameChanged(ev) {
    this.setState({ uname: ev.nativeEvent.text });
  }

  onPasswordChanged(ev) {
    this.setState({ pass: ev.nativeEvent.text });
  }

  render() {
    if (this.state.isLoading)
      return ( 
        <ActivityIndicator
          style={styles.loading}
          size='large'/> 
      );
    else
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            value={this.state.uname}
            onChange={this.onUsernameChanged.bind(this)}
            underlineColorAndroid={'transparent'}
            placeholder='Username'/>
          <TextInput
            secureTextEntry={true}
            style={styles.textInput}
            value={this.state.pass}
            onChange={this.onPasswordChanged.bind(this)}
            underlineColorAndroid={'transparent'}
            placeholder='Password'/>
          <TouchableHighlight style={styles.button}
              onPress={this.onLogin.bind(this)}
              underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button}
              onPress={this.onRegister.bind(this)}
              underlayColor='#1219FF'>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableHighlight>
          <Text style={styles.description}>{this.state.message}</Text>
        </View>
      );
  }
}