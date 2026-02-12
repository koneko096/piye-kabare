import { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import styles from '../style/FormStyles';
import CustomButton from '../widgets/CustomButton';
import FormInput from '../widgets/FormInput';
import socketService from '../utils/socketService';

const Register = ({ route, navigation }) => {
  const { socket, justLoggedIn } = route.params;
  const [name, setName] = useState('');
  const [uname, setUname] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const register = useStore((state) => state.register);

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
      socketService.on(socket, 'register_status', registerResp);
      return () => {
        socketService.off(socket, 'register_status', registerResp);
      };
    }
  }, [socket, registerResp]);

  const onRegister = () => {
    if (pass !== pass2) {
      setMessage("Password doesn't match");
      return;
    }
    setIsLoading(true);
    register(name, uname, pass);
  };

  return (
    <View style={styles.container}>
      <FormInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />
      <FormInput
        value={uname}
        onChangeText={setUname}
        placeholder="Username"
      />
      <FormInput
        secureTextEntry={true}
        value={pass}
        onChangeText={setPass}
        placeholder="Password"
      />
      <FormInput
        secureTextEntry={true}
        value={pass2}
        onChangeText={setPass2}
        placeholder="Confirm password"
      />
      <CustomButton
        title="Register"
        onPress={onRegister}
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

export default Register;