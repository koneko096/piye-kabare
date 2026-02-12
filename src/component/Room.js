import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as GiftedChatModule from 'react-native-gifted-chat';
import useStore from '../store/useStore';

const { GiftedChat, Actions, Bubble } = GiftedChatModule;

const Room = ({ route, navigation }) => {
  const socket = useStore((state) => state.socket);
  const userData = useStore((state) => state.userData);
  const { roomId, name, friends } = route.params;
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const newMessagesRef = useRef([]);

  const STORAGE_KEY = `chat_${roomId}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name || 'Chat',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (friends && friends.length > 0) {
              navigation.navigate('ContactList', {
                dataSource: friends,
                onClick: addMember
              });
            } else {
              if (socket) {
                socket.emit('find_friend', { userID: userData.userId });
                socket.once('find_friend_resp', (resp) => {
                  getMember(resp, (membersList) => {
                    navigation.navigate('ContactList', {
                      dataSource: membersList,
                      onClick: addMember
                    });
                  });
                });
              }
            }
          }}
          style={styles.inviteButton}
        >
          <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, name, socket, userData, friends]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    };
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      const handleAddResp = (resp) => {
        if (resp === 200) {
          console.log('Member added successfully');
          navigation.pop();
        } else {
          console.error('Failed to add member, error code:', resp);
          // Show error message logic could go here
        }
      };

      const handleKickResp = (resp) => {
        if (resp === 200) {
          console.log('Member removed successfully');
          navigation.pop();
        } else {
          console.error('Failed to remove member, error code:', resp);
        }
      };

      socket.on('add_resp', handleAddResp);
      socket.on('kick_resp', handleKickResp);

      // ADDED: Listener for incoming messages
      socket.on('receive', (resp) => {
        if (resp.roomID?.toString() === roomId?.toString()) {
          // Use name from route.params if it's a DM, otherwise fallback
          const senderName = (resp.senderID !== userData.userId && name) ? name : 'Friend';
          const newMessage = {
            _id: Math.random().toString(36).substring(7),
            text: resp.content,
            createdAt: new Date(resp.datetime),
            user: {
              _id: resp.senderID,
              name: senderName,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=random&color=fff&size=128`,
            },
          };
          setMessages(prev => GiftedChat.append(prev, [newMessage]));
        }
      });

      return () => {
        socket.off('add_resp', handleAddResp);
        socket.off('kick_resp', handleKickResp);
        socket.off('receive');
      };
    }
  }, [socket, roomId, navigation]);

  useEffect(() => {
    return () => {
      if (newMessagesRef.current.length > 0) {
        saveMessages(newMessagesRef.current);
      }
    };
  }, [roomId]);

  const saveMessages = async (newMsgs) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let allMessages = stored ? JSON.parse(stored) : [];
      allMessages = GiftedChat.append(allMessages, newMsgs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allMessages));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  };

  const getMember = (resp, cb) => {
    let membersList = [];
    if (typeof resp === 'object') {
      resp.map(function (el) {
        membersList.push({
          name: el.name,
          id: el._id
        });
      });
      setMembers(membersList);
    }
    cb(membersList);
  };

  const addMember = (item) => {
    const id = item.id || item;
    socket.emit('add', {
      roomId: roomId,
      userId: id
    });
  };

  const kickMember = (item) => {
    const id = item.id || item;
    socket.emit('kick', {
      roomId: roomId,
      userId: id
    });
  };

  const onSend = (newMsgs = []) => {
    newMsgs.forEach(message => {
      socket.emit('send', {
        senderID: message.user._id,
        roomID: roomId,
        content: message.text,
        datetime: message.createdAt
      });
    });

    const userMsgs = newMsgs.map(m => ({
      ...m,
      user: {
        ...m.user,
        name: userData.username || 'Me',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username || 'Me')}&background=0D8ABC&color=fff&size=128`,
      }
    }));

    setMessages(prev => GiftedChat.append(prev, userMsgs));
    newMessagesRef.current = [...newMessagesRef.current, ...userMsgs];
  };

  const renderCustomActions = (props) => {
    const options = {
      'Add member': () => {
        if (friends && friends.length > 0) {
          navigation.navigate('ContactList', {
            dataSource: friends,
            onClick: addMember
          });
        }
      },
      'Remove member': () => {
        socket.emit('find_member', { roomID: roomId });
        socket.once('find_member_resp', (resp) => {
          getMember(resp, (membersList) => {
            navigation.navigate('ContactList', {
              dataSource: membersList,
              onClick: kickMember
            });
          });
        });
      },
      'Cancel': () => { },
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  };

  const renderBubble = (props) => {
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
  };

  if (!GiftedChat) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: GiftedChat module not found. Check dependencies.</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#48BBEC" />
      </View>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      isLoadingEarlier={isLoadingEarlier}
      user={{
        _id: userData.userId,
        name: userData.username || 'Me',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username || 'Me')}&background=0D8ABC&color=fff`,
      }}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
      renderActions={renderCustomActions}
      renderBubble={renderBubble}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inviteButton: {
    marginRight: 10,
    backgroundColor: '#48BBEC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  inviteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Room;