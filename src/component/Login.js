import { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import styles from '../style/FormStyles';

const Login = ({ socket, navigation, justLoggedIn }) => {
  const [uname, setUname] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateUserData = useCallback((resp) => {
    if (typeof resp !== 'object') {
      setMessage('Wrong username or password');
      setUname('');
      setPass('');
      setIsLoading(false);
    } else {
      setIsLoading(false);
      justLoggedIn(resp);
    }
  }, [justLoggedIn]);

  useEffect(() => {
    if (socket) {
      socket.on('login_resp', updateUserData);
      return () => {
        socket.off('login_resp', updateUserData);
      };
    }
  }, [socket, updateUserData]);

  const onLogin = () => {
    if (!socket) return;
    setIsLoading(true);
    socket.emit('login', { username: uname, password: pass });
  };

  const onRegister = () => {
    navigation.navigate('Register', {
      socket: socket,
      justLoggedIn: justLoggedIn
    });
  };

  return (
    <View style={styles.container}>
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
      <TouchableHighlight
        style={styles.button}
        onPress={onLogin}
        underlayColor="#99d9f4"
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableHighlight>
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

export default Login;