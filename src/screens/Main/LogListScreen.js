import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getLogEntries } from '../../api/logs';
import supabase from '../../api/supabase';
// import LocationTest from '../../components/LocationTest'; // Testing complete - removed

const LogListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching logs for user:', user.id);
      const { data, error } = await getLogEntries();
      
      if (error) {
        throw error;
      }
      
      console.log('Fetched logs:', data);
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Set up realtime subscription for INSERT events
    if (user) {
      console.log('Setting up realtime subscription for user:', user.id);
      
      const subscription = supabase
        .channel('logs_inserts')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'logs'
          }, 
          (payload) => {
            console.log('Realtime INSERT event received:', payload);
            
            // Add the new log entry to the current logs state
            if (payload.new) {
              setLogs(currentLogs => [payload.new, ...currentLogs]);
            }
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        console.log('Cleaning up realtime subscription');
        subscription.unsubscribe();
      };
    }
  }, [user]);

  // Refresh logs when screen comes into focus (e.g., returning from create screen)
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchLogs();
      }
    }, [user])
  );

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logNotes}>{item.notes}</Text>
      <Text style={styles.logDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  const handleCreateLog = () => {
    navigation.navigate('CreateLog');
  };

  const handleFriends = () => {
    navigation.navigate('Friends');
  };

  const handleMap = () => {
    navigation.navigate('Map');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading logs...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Please log in to view logs</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Entries</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={handleMap}
          >
            <Text style={styles.mapButtonText}>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.friendsButton} 
            onPress={handleFriends}
          >
            <Text style={styles.friendsButtonText}>Friends</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No log entries yet</Text>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleCreateLog}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  mapButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  friendsButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  friendsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  logItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  logNotes: {
    fontSize: 16,
    marginBottom: 4,
  },
  logDate: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default LogListScreen; 