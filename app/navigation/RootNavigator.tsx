// navigation/RootNavigator.js
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import HomeTabs from './HomeTabs';
import AuthStack from './AuthStack';
import GetStartedScreen from '../screens/GetStartedScreen';
import SplashScreen from '../screens/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    AsyncStorage.getItem('@app_launched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('@app_launched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>

<Stack.Navigator screenOptions={{ headerShown: false }}>
       {isFirstLaunch ? (
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        ) : user ? (
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
    </Stack.Navigator>

    </NavigationContainer>
   
  );
}