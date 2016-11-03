import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableHighlight } from 'react-native';

import ContactList from './ContactList';
import FormStyles from '../style/FormStyles';

const styles = StyleSheet.create({
  label: {
    flex: 1,
    height: 50,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: '#EAEAEA'
  }
});

export default class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      gname: '',
      dataSource: this.props.dataSource
    };
    
    this.socket = this.props.socket;
    this.socket.on('create_resp', this.newGroup.bind(this));
  }

  addGroup(id) {
    let data = this.state.dataSource
    data.push({
      id : id,
      name : this.state.gname
    });
    this.setState({ dataSource: data, gname: '' });
  }

  newGroup(resp) {
    if (resp === 500) {
      this.setState({ message: 'Service error\nPlease try again', gname: '' });
    }
    else {
      console.log(resp);
      this.addGroup(resp);
    }
  }

  onGroupNameChanged(ev) {
    this.setState({ gname: ev.nativeEvent.text });
  }

  onCreateGroup() {
    this.socket.emit('create', {
      nameGroup: this.state.gname,
      adminId: this.props.userData.userId
    });
  }

  render() {
    const errMessage = (
      this.state.message !== '' ?
      <Text style={FormStyles.description}>{this.state.message}</Text> :
      <View/>
    );

    return (
      <View>
        <View style={styles.label}>
          <Text>New Group</Text>
        </View>
        <View>
          <TextInput
            style={FormStyles.textInput}
            value={this.state.gname}
            onChange={this.onGroupNameChanged.bind(this)}
            underlineColorAndroid={'transparent'}
            placeholder='Group name'/>
          <TouchableHighlight
            style={FormStyles.button}
            onPress={this.onCreateGroup.bind(this)}
            underlayColor='#1219FF'>
            <Text style={FormStyles.buttonText}>+</Text>
          </TouchableHighlight>
        </View>
        {errMessage}
        <View style={styles.label} />
        <ContactList
          dataSource={this.state.dataSource}
          onClick={this.props.onClick} />
      </View>
    );
  }
}