// components/FirstLaunchHandler.js
import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FirstLaunchHandler({ children }) {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // Use a completely new storage key
        const value = await AsyncStorage.getItem('@CoffeeApp_FIRST_LAUNCH_NEW_KEY');
        Alert.alert('Storage Value', `Value is: ${value}`); // Visual debug
        
        if (value === null) {
          await AsyncStorage.setItem('@CoffeeApp_FIRST_LAUNCH_NEW_KEY', 'false');
          Alert.alert('First Launch', 'This is first launch!'); // Visual debug
          setIsFirstLaunch(true);
        } else {
          Alert.alert('Not First Launch', 'This is NOT first launch'); // Visual debug
          setIsFirstLaunch(false);
        }
      } catch (error) {
        Alert.alert('Error', error.message); // Visual debug
        setIsFirstLaunch(true); // Default to showing welcome
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }

  return children(isFirstLaunch);
}