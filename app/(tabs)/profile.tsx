import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfileScreen";
import AccountDetailsScreen from "../screens/AccountDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import EmailSettingsScreen from "../screens/EmailSettingsScreen";
import LocationSettingsScreen from "../screens/LocationSettingsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AccountDetailsScreen" component={AccountDetailsScreen} />
      <Stack.Screen name="Notification" component={NotificationsScreen} />
      <Stack.Screen name="EmailSettingsScreen" component={EmailSettingsScreen} />
      <Stack.Screen name="LocationSettingsScreen" component={LocationSettingsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
