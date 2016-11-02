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
    this.socket = this.props.socket;
    this.state = {
      name: '',
      uname: '',
      pass: '',
      pass2: '',
      loggedIn: false,
      isLoading: false,
      message: ''
    };
  }

  clearForm() {
    this.setState({
      name: '',
      uname: '',
      pass: '',
      pass2: ''
    });
  }

  registerResp(resp) {
    switch (resp) {
      case 300:
        this.clearForm();
        this.setState({message: 'Username not available', isLoading: false});
        break;
      case 500:
        this.clearForm();
        this.setState({message: 'Service error\nPlease try again', isLoading: false});
        break;
      case 200:
        this.setState({message: 'User has been registered\nRedirecting to login page', isLoading: false});
        setTimeout(() => {
          this.props.navigator.pop();
        }, 1000);
        break;
    }
  }

  onRegister() {
    this.setState({ isLoading: true });

    if (this.state.pass !== this.state.pass2) {
      this.setState({ isLoading: false, message: 'Password doesn\'t match' })
      return;
    }

    this.socket.emit('register', {
      name: this.state.name, 
      username: this.state.uname, 
      password: this.state.pass
    });

    this.socket.on('register_status', this.registerResp.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loggedIn)
      this.props.justLoggedIn(this.state.userData);
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
        {pie}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}