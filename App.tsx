/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AuthProvider } from './src/context';
import RootNavigator from './src/navigation';
import { createLogEntry, getLogEntries } from './src/api/logs';

function App(): React.JSX.Element {
  // Test function (add this temporarily)
  const testLogsFunctions = async () => {
    // You'll need the current user's ID - get it from your AuthContext
    const userId = 'your-test-user-id'; // Replace with actual user ID
    
    // Test creating a log entry
    console.log('Testing createLogEntry...');
    const createResult = await createLogEntry(userId, { notes: 'Test log entry' });
    console.log('Create result:', createResult);
    
    // Test fetching log entries
    console.log('Testing getLogEntries...');
    const fetchResult = await getLogEntries(userId);
    console.log('Fetch result:', fetchResult);
  };

  // Call this function somewhere in your component
  testLogsFunctions();

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

export default App;
