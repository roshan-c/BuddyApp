import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { getCurrentPosition, requestLocationPermission } from '../../utils/location';
import { useAuth } from '../../context/AuthContext';
import { getLogEntries } from '../../api/logs';

const MapScreen = () => {
  const { user } = useAuth();
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default to San Francisco
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    getCurrentUserLocation();
    fetchLogsWithLocation();
  }, [user]);

  const fetchLogsWithLocation = async () => {
    if (!user) {
      console.log('No user, skipping log fetch');
      return;
    }

    try {
      setLogsLoading(true);
      console.log('Fetching logs for map display...');
      
      const { data, error } = await getLogEntries();
      
      if (error) {
        throw error;
      }
      
      // Filter logs that have location data
      const logsWithLocation = (data || []).filter(log => 
        log.location && 
        log.location.latitude && 
        log.location.longitude
      );
      
      console.log(`Found ${logsWithLocation.length} logs with location data out of ${data?.length || 0} total logs`);
      setLogs(logsWithLocation);
      
    } catch (error) {
      console.error('Error fetching logs for map:', error);
      Alert.alert(
        'Error',
        'Could not load log entries for the map.',
        [{ text: 'OK' }]
      );
    } finally {
      setLogsLoading(false);
    }
  };

  const getCurrentUserLocation = async () => {
    try {
      setLoading(true);
      
      // Request location permission
      const hasPermission = await requestLocationPermission();
      
      if (hasPermission) {
        console.log('Getting current position for map...');
        const position = await getCurrentPosition();
        
        if (position) {
          const newRegion = {
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          
          setRegion(newRegion);
          setUserLocation({
            latitude: position.latitude,
            longitude: position.longitude,
          });
          
          console.log('Map centered on user location:', newRegion);
        } else {
          console.log('Could not get current position, using default location');
        }
      } else {
        console.log('Location permission denied, using default location');
      }
    } catch (error) {
      console.warn('Error getting location for map:', error);
      Alert.alert(
        'Location Error',
        'Could not get your current location. Using default location.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        {/* Render markers for log entries with location data */}
        {logs.map((log) => (
          <Marker
            key={log.id}
            coordinate={{
              latitude: log.location.latitude,
              longitude: log.location.longitude,
            }}
            title={`Log Entry`}
            description={log.notes.length > 50 ? `${log.notes.substring(0, 50)}...` : log.notes}
            pinColor="#007AFF"
          >
            <Callout style={styles.callout}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>Log Entry</Text>
                <Text style={styles.calloutDate}>
                  {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString()}
                </Text>
                <Text style={styles.calloutNotes} numberOfLines={3}>
                  {log.notes}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {logsLoading && (
        <View style={styles.logsLoadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.logsLoadingText}>Loading log entries...</Text>
        </View>
      )}
      
      {/* Info overlay showing number of log markers */}
      {logs.length > 0 && !logsLoading && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {logs.length} log {logs.length === 1 ? 'entry' : 'entries'} with location
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  logsLoadingContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logsLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  callout: {
    width: 200,
  },
  calloutContainer: {
    padding: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  calloutDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  calloutNotes: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapScreen; 