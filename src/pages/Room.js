import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import useStore from '../store/useStore';
import { getAvatarUrl } from '../utils/avatar';
import chatUtils from '../utils/chat';
import ChatActions from '../widgets/ChatActions';
import ChatBubble from '../widgets/ChatBubble';

const Room = ({ route, navigation }) => {
  const { roomId, name } = route.params;

  const socket = useStore((state) => state.socket);
  const userData = useStore((state) => state.userData);
  const friends = useStore((state) => state.friends);
  const messages = useStore((state) => state.messages[roomId] || []);
  const sendMessage = useStore((state) => state.sendMessage);
  const loadMessages = useStore((state) => state.loadMessages);
  const addMessage = useStore((state) => state.addMessage);
  const storeAddMember = useStore((state) => state.addMember);
  const storeKickMember = useStore((state) => state.kickMember);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);

  const handleAddMember = useCallback((item) => {
    const userId = item.id || item;
    storeAddMember(roomId, userId);
    navigation.pop();
  }, [roomId, storeAddMember, navigation]);

  const handleKickMember = useCallback((item) => {
    const userId = item.id || item;
    storeKickMember(roomId, userId);
    navigation.pop();
  }, [roomId, storeKickMember, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name || 'Chat',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ContactList', {
              dataSource: friends,
              onClick: handleAddMember
            });
          }}
          style={styles.inviteButton}
        >
          <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, name, friends, handleAddMember]);

  useEffect(() => {
    loadMessages(roomId);
  }, [roomId, loadMessages]);

  useEffect(() => {
    if (socket) {
      const handleReceive = (resp) => {
        if (resp.roomID?.toString() === roomId?.toString()) {
          const senderName = (resp.senderID !== userData.userId && name) ? name : 'Friend';
          const msg = chatUtils.formatMessage(resp, senderName);
          msg.user.avatar = getAvatarUrl(senderName, 'random', 'fff');
          addMessage(roomId, msg);
        }
      };

      socket.on('receive', handleReceive);
      return () => socket.off('receive', handleReceive);
    }
  }, [socket, roomId, userData, name, addMessage]);

  const onSend = (newMsgs = []) => {
    newMsgs.forEach(msg => sendMessage(roomId, msg.text));
  };

  const renderActions = (props) => (
    <ChatActions
      {...props}
      roomId={roomId}
      friends={friends}
      navigation={navigation}
      onAddMember={handleAddMember}
      onKickMember={handleKickMember}
      socket={socket}
    />
  );

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
        avatar: getAvatarUrl(userData.username || 'Me', '0D8ABC', 'fff'),
      }}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
      renderActions={renderActions}
      renderBubble={(props) => <ChatBubble {...props} />}
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