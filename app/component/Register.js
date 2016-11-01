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

import styles from '../style/FormStyles';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      uname: '',
      pass: '',
      pass2: '',
      loggedIn: this.props.loggedIn,
      isLoading: false,
      message: ''
    };
  }

  onRegister() {
    // var socket = this.props.socket;
    // socket.emit('login', {uname: this.state.uname, pass: this.state.pass});
    this.setState({ isLoading: true, loggedIn: true });
    // socket.on('login_status', function (userData) {
    //   this.setState({ message: JSON.stringify(userData) });
    // });
    this.props.navigator.pop();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loggedIn)
      this.props.justLoggedIn();
  }

  onNameChanged(ev) {
    this.setState({ name: ev.nativeEvent.text });
  }

  onUsernameChanged(ev) {
    this.setState({ uname: ev.nativeEvent.text });
  }

  onPasswordChanged(ev) {
    this.setState({ pass: ev.nativeEvent.text });
  }

  onPassword2Changed(ev) {
    this.setState({ pass2: ev.nativeEvent.text });
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
            value={this.state.name}
            onChange={this.onNameChanged.bind(this)}
            underlineColorAndroid={'transparent'}
            placeholder='Full Name'/>
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
          <TextInput
            secureTextEntry={true}
            style={styles.textInput}
            value={this.state.pass2}
            onChange={this.onPassword2Changed.bind(this)}
            underlineColorAndroid={'transparent'}
            placeholder='Confirm password'/>
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