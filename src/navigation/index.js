import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { View, Text, StyleSheet } from 'react-native';

const RootNavigator = () => {
  const { user, loading } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});

export default RootNavigator; 