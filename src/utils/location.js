import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

/**
 * Request location permissions for Android and iOS
 * @returns {Promise<boolean>} True if permission granted, false otherwise
 */
export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show your position on the map and attach location data to your log entries.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // iOS permissions are handled automatically by the system
      // when we call getCurrentPosition
      return true;
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get the current position of the device
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export const getCurrentPosition = async () => {
  try {
    // First request permission
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Location Permission Required',
        'Please enable location permissions to use this feature.'
      );
      return null;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting current position:', error);
          
          let errorMessage = 'Unable to get your current location.';
          switch (error.code) {
            case 1:
              errorMessage = 'Location permission denied.';
              break;
            case 2:
              errorMessage = 'Location service unavailable.';
              break;
            case 3:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          Alert.alert('Location Error', errorMessage);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  } catch (error) {
    console.error('Error in getCurrentPosition:', error);
    return null;
  }
}; 