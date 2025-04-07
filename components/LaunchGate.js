// components/LaunchGate.js
import React, { useState, useEffect } from 'react';
import * as Application from 'expo-application';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LaunchGate({ children }) {
  const [showApp, setShowApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const installationId = await Application.getInstallationTimeAsync();
        const now = new Date();
        const timeSinceInstall = now - installationId;
        
        // Show welcome screen if installed less than 5 minutes ago
        setShowApp(timeSinceInstall > 5 * 60 * 1000);
      } catch (error) {
        console.error('Error checking installation:', error);
        setShowApp(true); // Default to showing app
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return children(showApp);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});