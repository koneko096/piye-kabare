import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import useStore from '../store/useStore';
import ContactList from '../widgets/ContactList';
import GroupList from '../widgets/GroupList';
import AddFriend from './AddFriend';
import TabItem from '../widgets/TabItem';

const Dashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);

  const rooms = useStore((state) => state.rooms);
  const friends = useStore((state) => state.friends);
  const fetchData = useStore((state) => state.fetchData);
  const initiateChat = useStore((state) => state.initiateChat);
  const socket = useStore((state) => state.socket);
  const userData = useStore((state) => state.userData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (socket) {
      const handleChatResp = (room) => {
        const roomId = room.id || room;
        const name = room.name || '';
        navigation.navigate('Room', { roomId, name });
      };

      socket.on('chat_resp', handleChatResp);
      return () => socket.off('chat_resp', handleChatResp);
    }
  }, [socket, navigation]);

  const gotoRoom = useCallback((room) => {
    const roomId = room.id || room;
    const name = room.name || '';
    navigation.navigate('Room', { roomId, name });
  }, [navigation]);

  const gotoFriendRoom = useCallback((friend) => {
    const id = friend.id || friend;
    const name = friend.name || 'Chat';
    initiateChat(id, name);
  }, [initiateChat]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ContactList
            dataSource={friends}
            onClick={gotoFriendRoom}
          />
        );
      case 1:
        return (
          <GroupList
            dataSource={rooms}
            onClick={gotoRoom}
          />
        );
      case 2:
        return (
          <AddFriend
            onAdd={fetchData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TabItem title="Friends" isActive={activeTab === 0} onPress={() => setActiveTab(0)} />
        <TabItem title="Rooms" isActive={activeTab === 1} onPress={() => setActiveTab(1)} />
        <TabItem title="Add" isActive={activeTab === 2} onPress={() => setActiveTab(2)} />
      </View>
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#48BBEC',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#48BBEC',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});

export default Dashboard;