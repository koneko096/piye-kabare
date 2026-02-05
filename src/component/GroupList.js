import { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableHighlight } from 'react-native';
import ContactList from './ContactList';
import FormStyles from '../style/FormStyles';

const GroupList = ({ socket, userData, dataSource, onClick }) => {
  const [message, setMessage] = useState('');
  const [gname, setGname] = useState('');
  const [groups, setGroups] = useState(dataSource);

  useEffect(() => {
    setGroups(dataSource);
  }, [dataSource]);

  const newGroup = useCallback((resp) => {
    if (resp === 500) {
      setMessage('Service error\nPlease try again');
      setGname('');
    } else {
      const newGroups = [...groups, { id: resp, name: gname }];
      setGroups(newGroups);
      setGname('');
    }
  }, [groups, gname]);

  useEffect(() => {
    if (socket) {
      socket.on('create_resp', newGroup);
      return () => {
        socket.off('create_resp', newGroup);
      };
    }
  }, [socket, newGroup]);

  const onCreateGroup = () => {
    if (!socket || !gname) return;
    socket.emit('create', {
      nameGroup: gname,
      adminId: userData.userId
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.label}>
        <Text style={styles.labelText}>New Group</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={FormStyles.textInput}
          value={gname}
          onChangeText={setGname}
          underlineColorAndroid="transparent"
          placeholder="Group name"
          placeholderTextColor="#888888"
        />
        <TouchableHighlight
          style={FormStyles.button}
          onPress={onCreateGroup}
          underlayColor="#1219FF"
        >
          <Text style={FormStyles.buttonText}>+</Text>
        </TouchableHighlight>
      </View>
      {message !== '' && (
        <Text style={FormStyles.description}>{message}</Text>
      )}
      <View style={styles.label}>
        <Text style={styles.labelText}>Groups</Text>
      </View>
      <View style={{ flex: 1 }}>
        <ContactList
          dataSource={groups}
          onClick={onClick}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#FFF',
  }
});

export default GroupList;