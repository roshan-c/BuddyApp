import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createLogEntry } from '../../api/logs';
import { getCurrentPosition, requestLocationPermission } from '../../utils/location';

const CreateLogScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      Alert.alert('Error', 'Please enter some notes');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a log entry');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Creating log entry for user:', user.id);
      
      // Prepare log data
      const logData = { 
        notes: notes.trim() 
      };
      
      // Try to get location data
      setLocationLoading(true);
      try {
        // Request permission first
        const hasPermission = await requestLocationPermission();
        
        if (hasPermission) {
          console.log('Location permission granted, getting current position...');
          const position = await getCurrentPosition();
          
          if (position) {
            logData.location = {
              latitude: position.latitude,
              longitude: position.longitude
            };
            console.log('Location captured:', logData.location);
          } else {
            console.log('Could not get current position');
          }
        } else {
          console.log('Location permission denied');
        }
      } catch (locationError) {
        console.warn('Error getting location:', locationError);
        // Continue without location - it's optional
      } finally {
        setLocationLoading(false);
      }
      
      const { data, error } = await createLogEntry(user.id, logData);
      
      if (error) {
        throw error;
      }
      
      console.log('Log entry created successfully:', data);
      Alert.alert('Success', 'Log entry created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      console.error('Error creating log entry:', err);
      Alert.alert('Error', err.message || 'Failed to create log entry');
    } finally {
      setLoading(false);
      setLocationLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Log Entry</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter your notes here..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!loading}
        />
        
        {locationLoading && (
          <View style={styles.locationStatus}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.locationText}>Getting location...</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Create Log</Text>
            )}
          </TouchableOpacity>
        </View>
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateLogScreen; 