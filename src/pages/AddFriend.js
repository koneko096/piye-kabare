import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import styles from '../style/FormStyles';
import CustomButton from '../widgets/CustomButton';
import FormInput from '../widgets/FormInput';
import socketService from '../utils/socketService';

import useStore from '../store/useStore';

const AddFriend = ({ onAdd }) => {
  const socket = useStore((state) => state.socket);
  const uname = useStore((state) => state.userData?.username);
  const fetchData = useStore((state) => state.fetchData);
  const [friendUname, setFriendUname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAddResp = (resp) => {
      setIsLoading(false);
      switch (resp) {
        case 300:
          setFriendUname('');
          setMessage('User had become friend');
          break;
        case 400:
          setFriendUname('');
          setMessage('Username not found');
          break;
        case 500:
          setFriendUname('');
          setMessage('Service error\nPlease try again');
          break;
        case 200:
          setMessage('Request has been sent');
          setTimeout(() => {
            setMessage('');
          }, 1000);
          onAdd(); // This is fetchData passed from Dashboard
          break;
      }
    };

    if (socket) {
      socketService.on(socket, 'add_friend_resp', handleAddResp);
      return () => {
        socketService.off(socket, 'add_friend_resp', handleAddResp);
      };
    }
  }, [socket, onAdd]);

  const onFind = () => {
    if (!socket) return;
    socketService.emit(socket, 'add_friend', { uname: uname, fname: friendUname });
    setIsLoading(true);
  };

  return (
    <View style={styles.container}>
      <FormInput
        value={friendUname}
        onChangeText={setFriendUname}
        placeholder="Username"
      />
      <CustomButton
        title="Find"
        onPress={onFind}
        underlayColor="#1219FF"
      />
      {isLoading ? (
        <ActivityIndicator style={styles.loading} size="large" />
      ) : (
        <View />
      )}
      <Text style={styles.description}>{message}</Text>
    </View>
  );
};

export default AddFriend;