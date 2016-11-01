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

export default class AddFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      isLoading: false,
      message: ''
    };
  }

  onUsernameChanged(ev) {
    this.setState({ uname: ev.nativeEvent.text });
  }

  onFind() {
    // var socket = this.props.socket;
    // socket.emit('login', {uname: this.state.uname, pass: this.state.pass});
    this.setState({ isLoading: true });
    // socket.on('login_status', function (userData) {
    //   this.setState({ message: JSON.stringify(userData) });
    // });
  }

  render() {
    var loading = this.state.isLoading ?
      <ActivityIndicator
          style={styles.loading}
          size='large'/> :
      <View/>
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={this.state.uname}
          onChange={this.onUsernameChanged.bind(this)}
          underlineColorAndroid={'transparent'}
          placeholder='Username'/>
        <TouchableHighlight style={styles.button}
            onPress={this.onFind.bind(this)}
            underlayColor='#1219FF'>
          <Text style={styles.buttonText}>Find</Text>
        </TouchableHighlight>
        {loading}
      </View>
    );
  }
};