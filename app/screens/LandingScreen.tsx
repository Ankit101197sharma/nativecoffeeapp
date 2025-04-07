import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LandingScreen = ({ navigation }) => {
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('alreadyLaunched', 'true'); // Save launch flag
      navigation.replace('HomeTabs'); // Navigate to main app
    } catch (error) {
      console.error("Error saving launch status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/coffiee.png')} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Fall in Love with Coffee in Blissful Delight!</Text>
        <Text style={styles.subtitle}>Welcome to our cozy coffee corner, where every cup is a delightful experience.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  image: { width: '100%', height: '60%', position: 'absolute', top: 0 },
  textContainer: { marginTop: '70%', paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#ddd', textAlign: 'center' },
  button: { marginTop: 20, backgroundColor: '#D2691E', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default LandingScreen;
