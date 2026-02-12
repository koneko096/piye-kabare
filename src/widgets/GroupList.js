import { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ContactList from './ContactList';
import FormStyles from '../style/FormStyles';
import FormInput from './FormInput';
import CustomButton from './CustomButton';
import socketService from '../utils/socketService';

const GroupList = ({ socket, userData, dataSource, onClick }) => {
  const [message, setMessage] = useState('');
  const [gname, setGname] = useState('');
  const [groups, setGroups] = useState(dataSource);

  useEffect(() => {
    setGroups(dataSource);
  }, [dataSource]);

  const onCreateGroup = () => {
    if (!socket || !gname) return;
    socketService.emit(socket, 'create', {
      nameGroup: gname,
      adminId: userData.userId
    });
    setGname('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.label}>
        <Text style={styles.labelText}>New Group</Text>
      </View>
      <View style={styles.inputContainer}>
        <FormInput
          value={gname}
          onChangeText={setGname}
          placeholder="Group name"
        />
        <CustomButton
          title="+"
          onPress={onCreateGroup}
          underlayColor="#1219FF"
        />
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