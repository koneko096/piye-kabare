import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ContactList from '../widgets/ContactList';
import GroupList from '../widgets/GroupList';
import AddFriend from './AddFriend';
import TabItem from '../widgets/TabItem';
import socketService from '../utils/socketService';

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
      socketService.emit(socket, 'chat', {
        userId1: userData.userId,
        userId2: id,
        nameGroup: name // Required by the server to create a DM room
      });
    } else {
      console.warn('Socket or userData missing in gotoFriendRoom');
    }
  }, [socket, userData]);

  const onGoToRoom = useCallback((room) => {
    gotoRoom(room);
  }, [gotoRoom]);

  useEffect(() => {
    if (socket) {
      socketService.emit(socket, 'findRoom', userData.userId);
      socketService.emit(socket, 'find_friend', { userID: userData.userId });
    }
  }, [socket, userData.userId]);

  const handleCreateResp = useCallback((resp) => {
    if (typeof resp === 'string') {
      socketService.emit(socket, 'findRoom', userData.userId);
    }
  }, [socket, userData.userId]);

  useEffect(() => {
    if (socket) {
      socketService.on(socket, 'chat_resp', onGoToRoom);
      socketService.on(socket, 'findRoom_resp', getGroup);
      socketService.on(socket, 'find_friend_resp', getFriend);
      socketService.on(socket, 'create_resp', handleCreateResp);

      return () => {
        socketService.off(socket, 'chat_resp', onGoToRoom);
        socketService.off(socket, 'findRoom_resp', getGroup);
        socketService.off(socket, 'find_friend_resp', getFriend);
        socketService.off(socket, 'create_resp', handleCreateResp);
      };
    }
  }, [socket, onGoToRoom, getGroup, getFriend, handleCreateResp]);

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