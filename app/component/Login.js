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
    this.socket = this.props.socket;
    this.state = {
      uname: '',
      pass: '',
      loggedIn: false,
      isLoading: false,
      message: ''
    };
  }

  updateUserData(resp) {
    if (typeof(resp) !== 'object') {
      this.setState({
        message: 'Wrong username or password',
        uname: '', pass: '',
        isLoading: false
      });
    } else {
      this.setState({ 
        loggedIn: true, isLoading: false, 
        userData: resp
      })
    };
  }

  onLogin() {
    this.setState({ isLoading: true });

    this.socket.emit('login', {username: this.state.uname, password: this.state.pass});

    this.socket.on('login_resp', this.updateUserData.bind(this));
  }

  justLoggedIn(userData) {
    this.setState({ loggedIn: true, userData: userData, isLoading: false});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loggedIn)
      this.props.justLoggedIn(this.state.userData);
  }

  onRegister() {
    this.props.navigator.push({
      title: 'Register',
      component: Register,
      passProps: {
        socket: this.socket,
        justLoggedIn: this.justLoggedIn.bind(this)
      }
    });
  }

  onUsernameChanged(ev) {
    this.setState({ uname: ev.nativeEvent.text });
  }

  onPasswordChanged(ev) {
    this.setState({ pass: ev.nativeEvent.text });
  }

  render() {
    const pie = (
      this.state.isLoading ? 
      <ActivityIndicator
        style={styles.loading}
        size='large'/> :
      <View/>
    );
    
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
        {pie}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}