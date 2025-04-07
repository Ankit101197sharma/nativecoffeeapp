import { router } from 'expo-router';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function WelcomeScreen() {
  return (
    <ImageBackground 
      source={require("../assets/images/coffiee.png")}
      style={styles.background}
      resizeMode="contain"
    >
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Fall in Love with Coffee in Blissful Delight!</Text>
        <Text style={styles.subtitle}>
          Welcome to our cozy coffee corner, where every cup is a delightful experience for you.
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', 
  },
  bottomContainer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 50, 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#D2691E',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});