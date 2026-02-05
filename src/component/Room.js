import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';

const Room = ({ route, navigation, socket, userData }) => {
  const { roomId } = route.params;
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const newMessagesRef = useRef([]);

  const STORAGE_KEY = `chat_${roomId}`;

  useEffect(() => {
    // Load earlier messages
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
    const handleFindFriend = (resp) => manageMember(addMember, resp);
    const handleFindMember = (resp) => manageMember(kickMember, resp);

    if (socket) {
      socket.on('find_friend_resp', handleFindFriend);
      socket.on('find_member_resp', handleFindMember);
      socket.on('add_resp', console.log);
      socket.on('kick_resp', console.log);

      return () => {
        socket.off('find_friend_resp', handleFindFriend);
        socket.off('find_member_resp', handleFindMember);
      };
    }
  }, [socket, roomId]);

  useEffect(() => {
    return () => {
      // Save new messages on unmount
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

  const addMember = (id) => {
    socket.emit('add', {
      roomID: roomId,
      userID: id
    });
    navigation.pop();
  };

  const kickMember = (id) => {
    socket.emit('kick', {
      roomID: roomId,
      userID: id
    });
    navigation.pop();
  };

  const manageMember = (callback, resp) => {
    getMember(resp, (membersList) => {
      navigation.navigate('ContactList', {
        dataSource: membersList,
        onClick: callback
      });
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

    setMessages(prev => GiftedChat.append(prev, newMsgs));
    newMessagesRef.current = [...newMessagesRef.current, ...newMsgs];
  };

  const renderCustomActions = (props) => {
    const options = {
      'Add member': () => {
        socket.emit('find_friend', { userID: userData.userId });
      },
      'Remove member': () => {
        socket.emit('find_member', { roomID: roomId });
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

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      isLoadingEarlier={isLoadingEarlier}
      user={{
        _id: userData.userId
      }}
      renderActions={renderCustomActions}
      renderBubble={renderBubble}
    />
  );
};

export default Room;