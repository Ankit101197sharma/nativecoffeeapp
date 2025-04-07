import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ProfileScreen from "../screens/ProfileScreen";  
import EditProfileScreen from "../screens/EditProfileScreen";
import AccountDetailsScreen from "../screens/AccountDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import EmailSettingsScreen from "../screens/EmailSettingsScreen";
import LocationSettingsScreen from "../screens/LocationSettingsScreen";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"
import SignUpScreen from "../screens/SignUpScreen";
import { AuthProvider } from "@/context/AuthContext";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <AuthProvider>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="CheckoutDetails" component={CheckoutScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="AccountDetailsScreen" component={AccountDetailsScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationsScreen} />
      <Stack.Screen name="EmailSettingsScreen" component={EmailSettingsScreen} />
      <Stack.Screen name="LocationSettingsScreen" component={LocationSettingsScreen} />
      <Stack.Screen name="OrderTrackingScreen" component={OrderTrackingScreen} />
      <Stack.Screen name="Login" component={LoginScreen}    />
      <Stack.Screen name="Signup" component={SignUpScreen}   />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

    </Stack.Navigator>
    </AuthProvider>
  );
};

export default HomeStack;
