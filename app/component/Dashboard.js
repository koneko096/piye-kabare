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

import ScrollableTabView from 'react-native-scrollable-tab-view';

import ContentList from './ContentList';
import AddFriend from './AddFriend';
import Room from './Room';

import friends from '../data/friends';
import rooms from '../data/rooms';

export default class Dashboard extends Component {
  gotoRoom() {
    this.props.navigator.push({
      title: 'Room',
      component: Room
    });
  }

  gotoFriendRoom() {
    this.props.navigator.push({
      title: 'Room',
      component: Room
    });
  }

  render() {
    return (
      <ScrollableTabView 
        tabBarActiveTextColor='#48BBEC' 
        tabBarUnderlineStyle={{backgroundColor: '#48BBEC'}}>
        <ContentList 
          dataSource={friends} 
          onClick={this.gotoFriendRoom.bind(this)} 
          tabLabel="Friend List" />
        <ContentList 
          dataSource={rooms} 
          onClick={this.gotoRoom.bind(this)} 
          tabLabel="Room List" />
        <AddFriend tabLabel="Add Friend" />
      </ScrollableTabView>
    );
  }
};