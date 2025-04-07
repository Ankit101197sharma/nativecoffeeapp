import React,{useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { resetToAuth } from '../navigation/navigationRef';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const ProfileScreen = ({ navigation }) => {
  const { signOut,user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      // Refresh local user info when the screen is focused
      const refresh = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user); // assuming setUser is exposed from AuthContext
      };
  
      refresh();
    }, [])
  );
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      resetToAuth(); 
    } catch (error) {
      Alert.alert('Error', error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };
  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: handleLogout, style: 'destructive' }
      ]
    );
  };

  // Use user data from AuthContext
  const profileName = user?.user_metadata?.name || 'Guest';

  const profileEmail = user?.email || "user@gmail.com";

const fallbackImage = 'https://randomuser.me/api/portraits/men/1.jpg';


  return (
    <ScrollView style={styles.container}>
    <View >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>My Account</Text>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        {/* <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
        
        /> */}
       <Image
  source={user?.user_metadata?.photoURL 
    ? { uri: user.user_metadata.photoURL } 
    : require('../../assets/images/placeholder.jpeg')}
  style={styles.profileImage}
/>


        <View>
        <Text style={styles.profileName}>{profileName}</Text>
        <Text style={styles.profileEmail}>{profileEmail}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}> 
          <Ionicons name="create-outline" size={30} color="white" style={styles.editButton} />
        </TouchableOpacity>
      </View>
      
      {/* Settings Section */}
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingsContainer}>
        <SettingItem icon="person-outline" label="Account Details" onPress={() => navigation.navigate("AccountDetailsScreen")} />
        <SettingItem icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate("Notification")} />
        <SettingItem icon="mail-outline" label="Email" onPress={() => navigation.navigate("EmailSettingsScreen")} />
        <SettingItem icon="location-outline" label="Location Services" onPress={() => navigation.navigate("LocationSettingsScreen")} />
        <SettingItem icon="log-out-outline" label="Log Out" onPress={confirmLogout} />
      </View>
    
      <View style={{ flex: 1 }}>
  <Text style={styles.sectionTitle}>Support</Text>
  <View style={styles.settingsContainer}>
    <SettingItem icon="information-outline" label="Information" />
    <SettingItem icon="help-outline" label="Help" />
    <SettingItem icon="chatbubble-outline" label="Query" />
  </View>
</View>

    </View>
    </ScrollView>
  );
};

const SettingItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={20} color="white" />
      <Text style={styles.settingText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={20} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10, 
    marginTop: 20,
  },  
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    marginLeft: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 15,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: 'gray',
    fontSize: 14,
  },
  editButton: {
    marginLeft: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;
