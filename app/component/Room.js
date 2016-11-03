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
  }

  componentWillUnmount() {
    this.state.messages.forEach(val => {
      let {_id, ...v} = val;
      v.roomId = this.props.roomId;
      DB.chat.add(v);
    });
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            // messages: GiftedChat.prepend(previousState.messages, require('../data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    messages.forEach(message => {
      console.log(message)
      this.socket.emit('send', {
        senderID: this.props.userData.userId,
        roomID: this.props.roomId,
        content: message.text,
        datetime: message.createdAt
      });
    });

    this.setState({
      messages: GiftedChat.append(this.state.messages, messages),
    });
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  onReceive(text) {
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
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
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
        onLoadEarlier={this.onLoadEarlier.bind(this)}
        isLoadingEarlier={this.state.isLoadingEarlier}

        user={{
          _id: 1, // sent messages should have same user._id
        }}

        renderActions={this.renderCustomActions.bind(this)}
        renderBubble={this.renderBubble.bind(this)}
        renderCustomView={this.renderCustomView.bind(this)}
      />
    );
  }
}

module.exports = Room;