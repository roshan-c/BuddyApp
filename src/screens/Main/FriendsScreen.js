import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { sendFriendshipRequest } from '../../api/friendships';

const FriendsScreen = () => {
  const [friendUserId, setFriendUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!friendUserId.trim()) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await sendFriendshipRequest(friendUserId.trim());
      
      if (error) {
        Alert.alert('Error', error.message || 'Failed to send friendship request');
        return;
      }

      Alert.alert('Success', 'Friendship request sent!');
      setFriendUserId('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send friendship request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Friend Request</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter user ID"
          value={friendUserId}
          onChangeText={setFriendUserId}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendRequest}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending...' : 'Send Request'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FriendsScreen; 