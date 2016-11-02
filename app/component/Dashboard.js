'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import ContactList from './ContactList';
import GroupList from './GroupList';
import AddFriend from './AddFriend';
import Room from './Room';

import friends from '../data/friends';

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: [],
      friends: []
    };

    this.socket = this.props.socket;
  }

  getGroup(resp) {
    if (typeof(resp) === 'object') {
      let rooms = this.state.rooms;
      resp.map(function (el) {
        rooms.push({
          name: el.nameGroup,
          id: el._id
        });
      });
      this.setState({ rooms: rooms });
    };
  }

  componentWillMount() {
    this.socket.emit('findRoom', this.props.userData.userId);
    this.socket.on('findRoom_resp', this.getGroup.bind(this));
  }

  gotoRoom(id) {
    this.props.navigator.push({
      title: 'Room',
      component: Room,
      passProps: {roomId: id}
    });
  }

  gotoFriendRoom(id) {
    this.findFriendRoom(id, this.gotoRoom);
  }

  findFriendRoom(friendId, callback) {
    // this.socket.emit('find_group')
  }

  render() {
    let pos = (
      Platform.OS === 'ios' ?
      'bottom' :
      'top'
    );
    return (
      <ScrollableTabView 
        tabBarPosition={pos}
        tabBarActiveTextColor='#48BBEC' 
        tabBarUnderlineStyle={{backgroundColor: '#48BBEC'}}>
        <ContactList 
          dataSource={friends}
          onClick={this.gotoFriendRoom.bind(this)}
          tabLabel="Friend List" />
        <GroupList 
          dataSource={this.state.rooms}
          onClick={this.gotoRoom.bind(this)}
          socket={this.socket}
          userData={this.props.userData}
          tabLabel="Room List" />
        <AddFriend 
          socket={this.socket}
          uname={this.props.userData.username}
          tabLabel="Add Friend" />
      </ScrollableTabView>
    );
  }
};