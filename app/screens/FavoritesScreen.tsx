import React, { useState } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, StyleSheet,ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigation } from "@react-navigation/native";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { wishlist, toggleWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter wishlist items based on search query
  const filteredWishlist = wishlist.filter((item) =>
    item.name.toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My <Text style={{ color: '#D2691E' }}>Wishlist</Text></Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          placeholder="Search Coffee"
          placeholderTextColor="gray"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      {/* Wishlist Items */}
      <FlatList
        data={filteredWishlist}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {/* Product Name at the Top Left */}
            <Text style={styles.productName}>{item.name}</Text>

            {/* Product Image */}
            <ImageBackground source={item.Image} style={styles.productImage} />

            {/* Price and Heart in One Row at the Bottom */}
            <View style={styles.priceHeartContainer}>
              <Text style={styles.productPrice}> {item.price}</Text>
              <TouchableOpacity onPress={() => toggleWishlist(item)}>
                <Ionicons name="heart" size={20} color="white" style={styles.heartIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 15,
    width: '48%',
    height: 180,
    marginBottom: 15,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#D2441B',
    
   
  },
  productName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 14,
    marginBottom: 4,
    
  },
  productImage: {
    flex: 1,
    width: 130,
  
    borderRadius:30 ,
   
  },
  priceHeartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    marginTop: 8,
    backgroundColor:"#C0C0C0",
    alignItems:"center",
    borderRadius:18
  },
  productPrice: {
    color: '#D2691E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heartIcon: {
    backgroundColor: '#D2691E',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoritesScreen;
