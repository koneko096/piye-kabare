import React, { useLayoutEffect, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useStore from '../store/useStore';
import Dashboard from './Dashboard';
import Login from './Login';

const Home = ({ navigation }) => {
  const loggedIn = useStore((state) => state.loggedIn);
  const socket = useStore((state) => state.socket);
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const logout = useStore((state) => state.logout);
  const initSocket = useStore((state) => state.initSocket);

  useEffect(() => {
    if (!socket) {
      initSocket('http://localhost:8083');
    }
  }, [socket, initSocket]);

  const justLoggedIn = (data) => {
    setUserData(data);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        loggedIn ? (
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ) : null
      ),
    });
  }, [navigation, loggedIn, logout]);

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

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10,
    padding: 5,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});

export default Home;