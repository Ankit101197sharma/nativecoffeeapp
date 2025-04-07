import React, { useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from "@react-navigation/native";
const NotificationsScreen = () => {
     const navigation = useNavigation();
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
  
    return (
      <View style={styles.container}>
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
        <Text style={styles.title}>Notification Settings</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Push Notifications</Text>
          <Switch value={pushNotifications} onValueChange={setPushNotifications} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Email Notifications</Text>
          <Switch value={emailNotifications} onValueChange={setEmailNotifications} />
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
    },
    label: {
      color: 'white',
      fontSize: 16,
      marginBottom: 10,
    },
    input: {
      backgroundColor: '#2a2a2a',
      color: 'white',
      padding: 10,
      borderRadius: 8,
      marginBottom: 20,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#D2691E',
      padding: 10,
      borderRadius: 8,
      width: '45%',
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#555',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });

export default NotificationsScreen;
