import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useStore from './store/useStore';

import Home from './pages/Home';
import Register from './pages/Register';
import ContactList from './widgets/ContactList';
import Room from './pages/Room';

const Stack = createNativeStackNavigator();

const App = () => {
    const initSocket = useStore((state) => state.initSocket);

    useEffect(() => {
        // Initialize socket connection
        initSocket('http://localhost:8083');
    }, [initSocket]);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: 'Piye Kabare' }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                />
                <Stack.Screen
                    name="ContactList"
                    component={ContactList}
                    options={{ title: 'Select' }}
                />
                <Stack.Screen
                    name="Room"
                    component={Room}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
