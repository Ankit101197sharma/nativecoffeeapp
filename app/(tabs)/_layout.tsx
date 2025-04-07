import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from '../navigation/HomeStack';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileStack from '../navigation/ProfileStack';
import { WishlistProvider } from '../../context/WishlistContext';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <WishlistProvider>
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 0,
              height: 80,
              paddingBottom: 10,
              paddingTop: 10,
              elevation: 0,
              shadowOpacity: 0,
              position: 'absolute',
              bottom: 0,
              left: 20,
              right: 20,
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
            },
            tabBarIcon: ({ focused }) => {
              let iconName;
              const iconColor = focused ? '#D2691E' : '#808080';
              const iconSize = 24;

              switch (route.name) {
                case 'Home':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'Wishlist':
                  iconName = focused ? 'heart' : 'heart-outline';
                  break;
                case 'Profile':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
                default:
                  iconName = 'home-outline';
              }

              return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: 'bold',
              marginTop: 4,
            },
            tabBarActiveTintColor: '#D2691E',
            tabBarInactiveTintColor: '#808080',
            tabBarItemStyle: {
              padding: 4,
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeStack}
            options={{ title: 'Home' }}
          />
          <Tab.Screen 
            name="Wishlist" 
            component={FavoritesScreen}
            options={{ title: 'Wishlist' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileStack}
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
      </View>
    </WishlistProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});