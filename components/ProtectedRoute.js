import React from 'react';
import { useAuth } from '../context/AuthContext';
import { View, Text, Button } from 'react-native';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (!user) {
    return (
      <View>
        <Text>You need to be logged in to view this page</Text>
        <Button 
          title="Go to Login" 
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;