import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CoffeeApp!</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.replace('HomeTabs')}
        color="#D2691E"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color:"#fff",
  },
});