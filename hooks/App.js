
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';
import RootNavigator from '../app/navigation/RootNavigator';
import AuthStack from '../app/navigation/AuthStack';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthWrapper>
        <RootStack.Screen name="AuthStack" component={AuthStack} />
          <RootNavigator />
        </AuthWrapper>
      </NavigationContainer>
    </AuthProvider>
  );
}