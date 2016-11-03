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
    
    this.socket = this.props.socket;
    this.socket.on('add_friend_resp', this.addResp.bind(this));
  }

  onUsernameChanged(ev) {
    this.setState({ uname: ev.nativeEvent.text });
  }

  clearForm() { this.setState({ uname: '' }); }

  addResp(resp) {
    switch (resp) {
      case 300:
        this.clearForm();
        this.setState({message: 'User had become friend', isLoading: false});
        break;
      case 400:
        this.clearForm();
        this.setState({message: 'Username not found', isLoading: false});
        break;
      case 500:
        this.clearForm();
        this.setState({message: 'Service error\nPlease try again', isLoading: false});
        break;
      case 200:
        this.setState({message: 'Request has been sent', isLoading: false});
        setTimeout(() => {
          this.setState({message: ''});
        }, 500);
        this.props.onAdd();
        break;
    }
  }

  onFind() {
    this.socket.emit('add_friend', { uname: this.props.uname, fname: this.state.uname });
    this.setState({ isLoading: true });
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
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
};