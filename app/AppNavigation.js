// AppNavigation.js
import { NavigationContainer } from '@react-navigation/native';
import HomeTabs from './navigation/HomeTabs';

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <HomeTabs />
    </NavigationContainer>
  );
}