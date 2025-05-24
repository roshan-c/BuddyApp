import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/Main/MainScreen';
import LogListScreen from '../screens/Main/LogListScreen';
import CreateLogScreen from '../screens/Main/CreateLogScreen';
import FriendsScreen from '../screens/Main/FriendsScreen';
import MapScreen from '../screens/Main/MapScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LogList">
      <Stack.Screen 
        name="Main" 
        component={MainScreen}
        options={{ title: 'Buddy App' }}
      />
      <Stack.Screen 
        name="LogList" 
        component={LogListScreen}
        options={{ title: 'Log Entries' }}
      />
      <Stack.Screen 
        name="CreateLog" 
        component={CreateLogScreen}
        options={{ title: 'Create Log Entry' }}
      />
      <Stack.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ title: 'Friends' }}
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen}
        options={{ title: 'Map' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 