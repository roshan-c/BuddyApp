import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/Main/MainScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen 
        name="Main" 
        component={MainScreen}
        options={{ title: 'Buddy App' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 