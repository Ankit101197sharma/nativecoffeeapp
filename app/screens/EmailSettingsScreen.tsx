import React, { useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const EmailSettingsScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('lily.freya12@apple.com');
  const [promotions, setPromotions] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Email Settings</Text>
      </View>
      
      {/* Email Input */}
      <Text style={styles.label}>Your Email</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
      />
      
      {/* Toggle for Promotions */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Receive Promotional Emails</Text>
        <Switch value={promotions} onValueChange={setPromotions} />
      </View>
      
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#D2691E',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#808080',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailSettingsScreen;
