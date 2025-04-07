// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { AuthProvider } from '../context/AuthContext';
// import { WishlistProvider } from '../context/WishlistContext';
// import RootNavigator from './navigation/RootNavigator';

// export default function AppWrapper() {
//   return (
//     <NavigationContainer>
//       <AuthProvider>
//         <WishlistProvider>
//           <RootNavigator />
//         </WishlistProvider>
//       </AuthProvider>
//     </NavigationContainer>
//   );
// }

// components/AuthWrapper.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';

export default function AuthWrapper({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}