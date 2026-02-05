import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import styles from '../style/FormStyles';

const AddFriend = ({ socket, onAdd, uname }) => {
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
          onAdd();
          break;
      }
    };

    if (socket) {
      socket.on('add_friend_resp', handleAddResp);
      return () => {
        socket.off('add_friend_resp', handleAddResp);
      };
    }
  }, [socket, onAdd]);

  const onFind = () => {
    if (!socket) return;
    socket.emit('add_friend', { uname: uname, fname: friendUname });
    setIsLoading(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={friendUname}
        onChangeText={setFriendUname}
        underlineColorAndroid="transparent"
        placeholder="Username"
        placeholderTextColor="#888888"
      />
      <TouchableHighlight
        style={styles.button}
        onPress={onFind}
        underlayColor="#1219FF"
      >
        <Text style={styles.buttonText}>Find</Text>
      </TouchableHighlight>
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