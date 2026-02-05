import useStore from '../store/useStore';
import Dashboard from './Dashboard';
import Login from './Login';

const Home = ({ navigation }) => {
  const loggedIn = useStore((state) => state.loggedIn);
  const socket = useStore((state) => state.socket);
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);

  const justLoggedIn = (data) => {
    setUserData(data);
  };

  if (loggedIn) {
    return (
      <Dashboard
        socket={socket}
        navigation={navigation}
        userData={userData}
      />
    );
  }

  return (
    <Login
      socket={socket}
      navigation={navigation}
      justLoggedIn={justLoggedIn}
    />
  );
};

export default Home;