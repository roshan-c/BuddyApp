import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { requestLocationPermission, getCurrentPosition } from '../utils/location';

const LocationTest = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const testPermission = async () => {
    try {
      setLoading(true);
      const hasPermission = await requestLocationPermission();
      setPermissionStatus(hasPermission ? 'Granted' : 'Denied');
      Alert.alert(
        'Permission Result', 
        hasPermission ? 'Location permission granted!' : 'Location permission denied!'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request permission');
    } finally {
      setLoading(false);
    }
  };

  const testGetLocation = async () => {
    try {
      setLoading(true);
      setLocation(null);
      
      const position = await getCurrentPosition();
      
      if (position) {
        setLocation(position);
        Alert.alert(
          'Location Retrieved!', 
          `Latitude: ${position.latitude}\nLongitude: ${position.longitude}`
        );
      } else {
        Alert.alert('Error', 'Failed to get location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testPermission}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Test Permission Request'}
        </Text>
      </TouchableOpacity>

      {permissionStatus && (
        <Text style={styles.status}>
          Permission Status: {permissionStatus}
        </Text>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={testGetLocation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Getting Location...' : 'Get Current Location'}
        </Text>
      </TouchableOpacity>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  locationText: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default LocationTest; 