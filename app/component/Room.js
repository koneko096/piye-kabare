'use strict';

import React, {Component} from 'react';
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
import ContactList from './ContactList';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import Store from 'react-native-store';

const DB = {
  chat: Store.model('chat')
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      members: [],
      newMessages: [],
      typingText: null,
      isLoadingEarlier: false
    };

    DB.chat.find({
      where: { roomId: this.props.roomId }
    }).then(value => 
      this.setState({
        messages: value !== null ? value : []
      })
    );

    this.socket = this.props.socket;
    this.socket.on('find_friend_resp', this.manageMember.bind(this, this.addMember.bind(this)));
    this.socket.on('find_member_resp', this.manageMember.bind(this, this.kickMember.bind(this)));
    this.socket.on('add_resp', console.log)
    this.socket.on('kick_resp', console.log)
  }

  componentWillUnmount() {
    this.state.newMessages.forEach(val => {
      let {_id, ...v} = val;
      v.roomId = this.props.roomId;
      DB.chat.add(v);
    });
  }

  getMember(resp, cb) {
    let members = [];
    if (typeof(resp) === 'object') {
      resp.map(function (el) {
        members.push({
          name: el.name,
          id: el._id
        });
      });
      this.setState({ members: members });
    };
    cb(members);
  }

  addMember(id) {
    this.socket.emit('add', {
      roomID: this.props.roomId,
      userID: id
    });
    this.props.navigator.pop();
  }

  kickMember(id) {
    this.socket.emit('kick', {
      roomID: this.props.roomId,
      userID: id
    });
    this.props.navigator.pop();
  }

  manageMember(callback, resp) {
    this.getMember(resp, (members) => {
      this.props.navigator.push({
        title: 'Select',
        component: ContactList,
        passProps: {
          dataSource: members,
          onClick: callback.bind(this)
        }
      });
    });
  }

  onSend(messages = []) {
    messages.forEach(message => {
      this.socket.emit('send', {
        senderID: message.user._id,
        roomID: this.props.roomId,
        content: message.text,
        datetime: message.createdAt
      });
    });

    this.setState({
      messages: GiftedChat.append(this.state.messages, messages),
      newMessages: GiftedChat.append(this.state.newMessages, messages)
    });
  }

  onReceive(message) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: this.props.roomId,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Add member': (props) => {
        this.socket.emit('find_friend', {userID: this.props.userData.userId});
      },
      'Remove member': (props) => {
        this.socket.emit('find_member', {roomID: this.props.roomId});
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  render() {
    this.onSend = this.onSend.bind(this)

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        isLoadingEarlier={this.state.isLoadingEarlier}

        user={{
          _id: this.props.userData.userId  // sent messages should have same user._id
        }}

        renderActions={this.renderCustomActions.bind(this)}
        renderBubble={this.renderBubble.bind(this)}
        renderCustomView={this.renderCustomView.bind(this)}
      />
    );
  }
}

module.exports = Room;