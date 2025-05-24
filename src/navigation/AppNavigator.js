import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/Main/MainScreen';
import LogListScreen from '../screens/Main/LogListScreen';

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
    </Stack.Navigator>
  );
};

export default AppNavigator; 