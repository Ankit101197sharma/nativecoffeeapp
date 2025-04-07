import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GetStartedScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CoffeeApp!</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'HomeTabs' }]
        })}
        color="#D2691E"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color:"#fff"
  }
});