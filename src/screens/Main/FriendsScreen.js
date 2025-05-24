import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { sendFriendshipRequest, getPendingRequests, acceptFriendshipRequest } from '../../api/friendships';

const FriendsScreen = () => {
  const [friendUserId, setFriendUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoadingRequests(true);
      const { data, error } = await getPendingRequests();
      
      if (error) {
        console.error('Error fetching pending requests:', error);
        return;
      }
      
      setPendingRequests(data || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

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

  const handleAcceptRequest = async (friendshipId) => {
    try {
      const { data, error } = await acceptFriendshipRequest(friendshipId);
      
      if (error) {
        Alert.alert('Error', error.message || 'Failed to accept friendship request');
        return;
      }

      Alert.alert('Success', 'Friendship request accepted!');
      // Refresh the pending requests list
      fetchPendingRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to accept friendship request');
    }
  };

  const renderPendingRequest = ({ item }) => {
    return (
      <View style={styles.requestItem}>
        <View style={styles.requestInfo}>
          <Text style={styles.requestText}>Request from: {item.user1_id}</Text>
          <Text style={styles.requestDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    );
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Requests</Text>
        {loadingRequests ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : pendingRequests.length === 0 ? (
          <Text style={styles.emptyText}>No pending requests</Text>
        ) : (
          <FlatList
            data={pendingRequests}
            renderItem={renderPendingRequest}
            keyExtractor={(item) => item.id}
            style={styles.requestsList}
          />
        )}
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
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  requestInfo: {
    flex: 1,
  },
  requestText: {
    fontSize: 16,
  },
  requestDate: {
    fontSize: 12,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  requestsList: {
    maxHeight: 200,
  },
});

export default FriendsScreen; 