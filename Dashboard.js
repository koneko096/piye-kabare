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

import data from './data';

export default class Dashboard extends Component {
  render() {
    return (
      <ScrollableTabView>
        <ContentList dataSource={data.friends} tabLabel="Friend List" />
        <ContentList dataSource={data.rooms} tabLabel="Room List" />
        <AddFriend tabLabel="Add Friend" />
      </ScrollableTabView>
    );
  }
};