import { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import styles from '../style/FormStyles';

const Register = ({ route, navigation }) => {
  const { socket, justLoggedIn } = route.params;
  const [name, setName] = useState('');
  const [uname, setUname] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const registerResp = useCallback((resp) => {
    setIsLoading(false);
    switch (resp) {
      case 300:
        setMessage('Username not available');
        break;
      case 500:
        setMessage('Service error\nPlease try again');
        break;
      case 200:
        setMessage('User has been registered\nRedirecting to login page');
        setTimeout(() => {
          navigation.pop();
        }, 1000);
        break;
    }
  }, [navigation]);

  useEffect(() => {
    if (socket) {
      socket.on('register_status', registerResp);
      return () => {
        socket.off('register_status', registerResp);
      };
    }
  }, [socket, registerResp]);

  const onRegister = () => {
    if (pass !== pass2) {
      setMessage("Password doesn't match");
      return;
    }
    setIsLoading(true);
    socket.emit('register', {
      name: name,
      username: uname,
      password: pass
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        underlineColorAndroid="transparent"
        placeholder="Full Name"
        placeholderTextColor="#888888"
      />
      <TextInput
        style={styles.textInput}
        value={uname}
        onChangeText={setUname}
        underlineColorAndroid="transparent"
        placeholder="Username"
        placeholderTextColor="#888888"
      />
      <TextInput
        secureTextEntry={true}
        style={styles.textInput}
        value={pass}
        onChangeText={setPass}
        underlineColorAndroid="transparent"
        placeholder="Password"
        placeholderTextColor="#888888"
      />
      <TextInput
        secureTextEntry={true}
        style={styles.textInput}
        value={pass2}
        onChangeText={setPass2}
        underlineColorAndroid="transparent"
        placeholder="Confirm password"
        placeholderTextColor="#888888"
      />
      <TouchableHighlight
        style={styles.button}
        onPress={onRegister}
        underlayColor="#1219FF"
      >
        <Text style={styles.buttonText}>Register</Text>
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

export default Register;