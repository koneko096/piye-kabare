import {
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import styles from '../style/FormStyles';
import CustomButton from '../widgets/CustomButton';
import FormInput from '../widgets/FormInput';
import socketService from '../utils/socketService';

const Login = ({ socket, navigation, justLoggedIn }) => {
  const [uname, setUname] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const login = useStore((state) => state.login);

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
      socketService.on(socket, 'login_resp', updateUserData);
      return () => {
        socketService.off(socket, 'login_resp', updateUserData);
      };
    }
  }, [socket, updateUserData]);

  const onLogin = () => {
    setIsLoading(true);
    login(uname, pass);
  };

  const onRegister = () => {
    navigation.navigate('Register', {
      socket: socket,
      justLoggedIn: justLoggedIn
    });
  };

  return (
    <View style={styles.container}>
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
      <CustomButton
        title="Login"
        onPress={onLogin}
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

export default Login;