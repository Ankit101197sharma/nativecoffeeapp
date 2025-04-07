

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWishlist } from '../../context/WishlistContext';
import { supabase } from '../../../MyApp/supabaseClient';
import { SUPABASE_CONFIG } from '../../../MyApp/config';

const categories = ['All Coffee', 'Caffe Mocha', 'Latte', 'Americano', "Flat White", "Cappuccino", "Cortado", "Affogato", "Espresso"];

const HomeScreen = (imageName) => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All Coffee');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { wishlist, toggleWishlist } = useWishlist();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      // Transform data to include full image URLs
      const formattedProducts = data.map(product => ({
        ...product,
        fullImageUrl: `${SUPABASE_CONFIG.URL}/${SUPABASE_CONFIG.STORAGE_PATH}/${product.image_url}`
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Fetch error:', {
        message: error.message,
        details: error.details,
        code: error.code
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };
  const filteredProducts = products.filter(product =>
    (selectedCategory === 'All Coffee' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };
  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>Location</Text>
          <Text style={styles.location}>Bilzen, Tanjungbalai ▼</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="white" />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          placeholder="Search coffee"
          placeholderTextColor="gray"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      <View style={styles.banner}>
        <Image 
          source={require('../../assets/images/coffiee1.png')} 
          style={styles.bannerImage} 
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.promoText}>Promo</Text>
          <Text style={styles.bannerText}>Buy one get one FREE</Text>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={selectedCategory === item ? styles.activeCategory : styles.category}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={selectedCategory === item ? styles.activeCategoryText : styles.categoryText}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
  const renderProductItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: item })}>
      <View style={styles.productCard}>
        <Image 
          source={{ uri: item.fullImageUrl }}
          style={styles.productImage}
          defaultSource={require('../../assets/images/placeholder.jpeg')}
          onError={(e) => console.log('Image load failed:', e.nativeEvent.error)}
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="white" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSubName}>{item.description}</Text>
        <View style={styles.priceAddContainer}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            toggleWishlist(item);
          }}>
            <Ionicons
              name={wishlist.some(w => w.id === item.id) ? "heart" : "heart-outline"}
              size={24}
              color={wishlist.some(w => w.id === item.id) ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D2691E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
        ListHeaderComponent={
          <View>
            {/* Header, Search, Banner, Categories (keep your existing code) */}
            {renderHeader()}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#D2691E']}
            tintColor={'#D2691E'}
          />
        }
        renderItem={renderProductItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No products found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 50,
    padding: 10,
    marginBottom: 10 
  },
  locationLabel: { 
    color: 'gray', 
    fontSize: 12 
  },
  location: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  searchContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#222', 
    padding: 10, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  searchInput: { 
    flex: 1, 
    color: 'white', 
    marginLeft: 10 
  },
  banner: { 
    position: 'relative', 
    marginVertical: 20 
  },
  bannerImage: { 
    width: '100%', 
    height: 150, 
    borderRadius: 15 
  },
  bannerOverlay: { 
    position: 'absolute', 
    top: 20, 
    left: 20 
  },
  promoText: { 
    backgroundColor: 'red', 
    color: 'white', 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 5, 
    fontSize: 12,
    width: 60
  },
  bannerText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'black', 
    marginTop: 5 
  },
  category: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E3E3E3',
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategory: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D2691E',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: '#313131',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productCard: { 
    backgroundColor: 'white', 
    padding: 9, 
    borderRadius: 15, 
    width: 170, 
    marginBottom: 15, 
    height: 230 
  },
  productImage: { 
    width: 156, 
    height: 120, 
    borderRadius: 10 
  },
  productName: { 
    color: '#313131', 
    fontWeight: 'bold', 
    textAlign: 'left' 
  },
  productSubName: { 
    color: '#555', 
    fontSize: 12, 
    textAlign: 'left' 
  },
  priceAddContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 5 
  },
  productPrice: { 
    color: '#313131', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default HomeScreen;
