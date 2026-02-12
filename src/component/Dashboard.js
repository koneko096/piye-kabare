import React, { useState, useEffect, useCallback } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import ContactList from './ContactList';
import GroupList from './GroupList';
import AddFriend from './AddFriend';

const Dashboard = ({ socket, navigation, userData }) => {
  const [rooms, setRooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const getGroup = useCallback((resp) => {
    if (Array.isArray(resp)) {
      const uniqueRooms = [];
      const seenIds = new Set();
      resp.forEach(el => {
        if (el._id && !seenIds.has(el._id)) {
          seenIds.add(el._id);
          uniqueRooms.push({
            name: el.nameGroup,
            id: el._id
          });
        }
      });
      setRooms(uniqueRooms);
    }
  }, []);

  const getFriend = useCallback((resp) => {
    if (typeof resp === 'object') {
      let friendsList = resp.map(el => ({
        name: el.name,
        id: el._id
      }));
      setFriends(friendsList);
    }
  }, []);

  const gotoRoom = useCallback((room) => {
    const roomId = room.id || room; // Handle both item object and bare ID from server resp
    const name = room.name || '';

    navigation.navigate('Room', {
      userData: userData,
      roomId: roomId,
      name: name,
      socket: socket,
      friends: friends // Pass the loaded friend list
    });
  }, [navigation, userData, socket, friends]);

  const gotoFriendRoom = useCallback((friend) => {
    const id = friend.id || friend;
    const name = friend.name || 'Chat';
    console.log('Initiating chat with friend:', id);
    if (socket && userData) {
      socket.emit('chat', {
        userId1: userData.userId,
        userId2: id,
        nameGroup: name // Required by the server to create a DM room
      });
    } else {
      console.warn('Socket or userData missing in gotoFriendRoom');
    }
  }, [socket, userData]);

  useEffect(() => {
    if (socket) {
      socket.emit('findRoom', userData.userId);
      socket.emit('find_friend', { userID: userData.userId });
    }
  }, [socket, userData.userId]);

  const handleCreateResp = useCallback((resp) => {
    if (typeof resp === 'string') {
      // Re-fetch rooms to ensure we have the latest server state and prevent duplicates
      socket.emit('findRoom', userData.userId);
    }
  }, [socket, userData.userId]);

  useEffect(() => {
    if (socket) {
      socket.on('chat_resp', gotoRoom);
      socket.on('findRoom_resp', getGroup);
      socket.on('find_friend_resp', getFriend);
      socket.on('create_resp', handleCreateResp);

      return () => {
        socket.off('chat_resp', gotoRoom);
        socket.off('findRoom_resp', getGroup);
        socket.off('find_friend_resp', getFriend);
        socket.off('create_resp', handleCreateResp);
      };
    }
  }, [socket, gotoRoom, getGroup, getFriend, handleCreateResp]);

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
            socket={socket}
            userData={userData}
          />
        );
      case 2:
        return (
          <AddFriend
            socket={socket}
            onAdd={() => socket.emit('find_friend', { userID: userData.userId })}
            uname={userData.username}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 0 && styles.activeTab]} onPress={() => setActiveTab(0)}>
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 1 && styles.activeTab]} onPress={() => setActiveTab(1)}>
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>Rooms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 2 && styles.activeTab]} onPress={() => setActiveTab(2)}>
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>Add</Text>
        </TouchableOpacity>
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