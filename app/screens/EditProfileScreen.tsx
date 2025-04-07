import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../supabaseClient';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();

  const fallbackImage = 'https://randomuser.me/api/portraits/men/1.jpg';


  
  const metadata = user?.user_metadata || {};
  const [name, setName] = useState(metadata.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [image, setImage] = useState(metadata.photoURL || fallbackImage);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);
 
// const uploadImage = async (uri, userId) => {
//   const response = await fetch(uri);
//   const blob = await response.blob();
//   const fileExt = uri.split('.').pop();
//   const fileName = `${userId}.${fileExt}`;

//   const { data, error } = await supabase.storage
//     .from('avatars')
//     .upload(fileName, blob, {
//       cacheControl: '3600',
//       upsert: true,
//     });

//   if (error) {
//     throw error;
//   }

//   return data.path;
// };

  // Updated image picker function
  const pickImage = async () => {
    if (!user) {
      Alert.alert("Please login to change profile picture");
      return;
    }
  
    try {
      setIsImageLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setIsImageLoading(false);
    }
  };
  const uploadImage = async (uri, userId) => {
    try {
      const fileExt = uri.split('.').pop().split('?')[0]; 
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${fileName}`;
  
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const { data, error } = await supabase.storage
        .from('avatars') // ensure this is your bucket name
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
        });
  
      if (error) {
        console.error('Upload error:', error.message);
        throw error;
      }
  
      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
  
      return publicData.publicUrl;
    } catch (err) {
      console.error('Upload failed:', err.message);
      throw err;
    }
  };
  
  
  const handleSave = async () => {
    if (!user) {
      Alert.alert("Please login to update profile");
      return;
    }
  
    setIsLoading(true);
    try {
      let imageUrl = image;
  
      // Upload new image if it's a local file
      if (image.startsWith("file:")) {
        imageUrl = await uploadImage(image, user.id);
      }
  
      await updateProfile({
        name,
        photoURL: imageUrl
      });
  
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage} disabled={isImageLoading}>
        {isImageLoading ? (
          <View style={[styles.profileImage, styles.loadingImage]}>
            <ActivityIndicator size="small" color="#FF8C00" />
          </View>
        ) : (
          <>
            <Image source={{ uri: image }} style={styles.profileImage} />
            <View style={styles.editIcon}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </>
        )}
      </TouchableOpacity>

      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Name" 
        placeholderTextColor="#aaa" 
        editable={!!user}
      />
      
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Email" 
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        editable={!!user}
      />

      <TouchableOpacity 
        style={[styles.saveButton, (!user || isLoading) && styles.disabledButton]} 
        onPress={handleSave}
        disabled={!user || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {!user && (
        <Text style={styles.loginPrompt}>Please login to edit your profile</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    alignItems: 'center' 
  },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20 
  },
  title: { 
    fontSize: 24, 
    color: 'white', 
    marginBottom: 20 
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 20 
  },
  loadingImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a'
  },
  input: { 
    width: '100%', 
    backgroundColor: '#2a2a2a', 
    color: 'white', 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  saveButton: { 
    backgroundColor: '#FF8C00', 
    padding: 12, 
    borderRadius: 10, 
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  saveText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loginPrompt: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  }
});

export default EditProfileScreen;