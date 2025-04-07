import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";

const SplashScreen = ({ navigation }) => {
   return (
      <ImageBackground 
         source={require("../../assets/images/coffiee.png")} 
         style={styles.background}
      >
         <View style={styles.overlay}>
            <Text style={styles.title}>Fall in Love with Coffee in Blissful Delight!</Text>
            <Text style={styles.subtitle}>
               Welcome to our cozy coffee corner, where every cup is a delightful experience for you.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
               <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
         </View>
      </ImageBackground>
   );
};

const styles = StyleSheet.create({
   background: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
   },
   overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)", 
      paddingHorizontal: 20,
   },
   title: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
      marginBottom: 10,
   },
   subtitle: {
      fontSize: 16,
      color: "#ccc",
      textAlign: "center",
      marginBottom: 20,
   },
   button: {
      backgroundColor: "#D2691E", 
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 10,
   },
   buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
   },
});

export default SplashScreen;
