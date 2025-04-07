import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SUPABASE_CONFIG } from "../../../MyApp/config";
import { supabase } from '../../supabaseClient';

const CheckoutScreen = ({ route, navigation }) => {
    const { product = { 
        price: 0, 
        image_url: null, 
        name: 'Product', 
        description: 'No description available' 
      } } = route.params || {};
    
      const [quantity, setQuantity] = useState(1);
      const [selectedTab, setSelectedTab] = useState('Deliver');
      const [selectedPayment, setSelectedPayment] = useState('Card');
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [isProcessing, setIsProcessing] = useState(false);
      const [discounts, setDiscounts] = useState([]);
      const [imageLoading, setImageLoading] = useState(true);
      console.log(`${SUPABASE_CONFIG.URL}/storage/v1/object/public/${SUPABASE_CONFIG.STORAGE_PATH}/${product.image_url}`);
      const availableDiscounts = [
        "🎉 10% Off",
        "🎉 Free Delivery",
        "🎉 $5 Off on Orders Above $50"
      ];
     const fullImageUrl = `${SUPABASE_CONFIG.URL}/${SUPABASE_CONFIG.STORAGE_PATH}/${product.image_url}`;
    
   
      // Quantity handlers
      const increaseQuantity = () => setQuantity(quantity + 1);
      const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    
      // Discount handlers
      const applyDiscount = (discount) => {
        if (!discounts.includes(discount)) {
          setDiscounts([...discounts, discount]);
        }
        setIsModalVisible(false);
      };
    
      const removeDiscount = (discount) => {
        setDiscounts(discounts.filter(item => item !== discount));
      };
    
      // Safely calculate price
      const getProductPrice = () => {
        // If price is a string with $, remove it and convert to number
        if (typeof product.price === 'string') {
          return parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
        }
        // If price is already a number, use it directly
        return Number(product.price) || 0;
      };
    
      // Calculate total with discounts
      const calculateTotal = () => {
        const price = getProductPrice();
        const basePrice = price * quantity;
        const deliveryFee = selectedTab === 'Deliver' ? 1.00 : 0;
        
        let total = basePrice + deliveryFee;
        
        // Apply discounts
        if (discounts.includes("🎉 10% Off")) {
          total *= 0.9; // 10% discount
        }
        if (discounts.includes("🎉 Free Delivery") && selectedTab === 'Deliver') {
          total -= 1.00;
        }
        if (discounts.includes("🎉 $5 Off on Orders Above $50") && total > 50) {
          total -= 5.00;
        }
        
        return total.toFixed(2);
      };
    
      const handlePlaceOrder = async () => {
        setIsProcessing(true);
        
        try {
          // 1. Verify authentication status
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          
          if (authError || !user) {
            // Show login modal if not authenticated
            Alert.alert(
              "Login Required",
              "You need to login to place an order",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Login Now", 
                  onPress: () => navigation.navigate("Login", {
                    // Return to checkout after successful login
                    onLoginSuccess: () => handlePlaceOrder() 
                  })
                }
              ]
            );
            return;
          }
      
          // 2. Refresh session if needed
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (!session || sessionError) {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) throw new Error("Session expired. Please login again");
          }
      
          // 3. Prepare order data
          const orderData = {
            product_id: product.id,
            product_name: product.name,
            user_id: user.id,
            quantity,
            unit_price: getProductPrice(),
            total_price: calculateTotal(),
            payment_method: selectedPayment,
            delivery_method: selectedTab,
            status: 'pending'
          };
      
          // 4. Submit order
          const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();
      
          if (error) throw error;
      
          // 5. Navigate to confirmation
          navigation.navigate("OrderTrackingScreen", { orderId: data.id });
      
        } catch (error) {
          console.error("Order Error:", {
            code: error.code,
            message: error.message,
            details: error.details
          });
      
          // Handle specific authentication errors
          if (error.message.includes("Authentication failed")) {
            // Force logout and redirect to login
            await supabase.auth.signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }]
            });
            Alert.alert(
              "Session Expired", 
              "Your session has expired. Please login again."
            );
          } else {
            Alert.alert(
              "Order Failed", 
              error.message || "Failed to place order. Please try again."
            );
          }
        } finally {
          setIsProcessing(false);
        }
      };
    
      // Check auth status when screen focuses
      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log("User is logged in:", user.email);
          }
        });
        return unsubscribe;
      }, [navigation]);
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Order</Text>
              <View style={{ width: 24 }} /> {/* Spacer for alignment */}
            </View>
    
            {/* Delivery & Pickup Tabs */}
            <View style={styles.tabContainer}>
              {['Deliver', 'Pick Up'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    selectedTab === tab && styles.activeTab
                  ]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText
                  ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
    
            {/* Delivery Address */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>Jl. Kpg Sutoyo</Text>
              <Text style={styles.subText}>Kpg. Sutoyo No. 620, Bilzen, Tanjungbalai.</Text>
              <View style={styles.addressActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={16} color="black" />
                  <Text style={styles.actionText}> Edit Address</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="add-outline" size={16} color="black" />
                  <Text style={styles.actionText}> Add Note</Text>
                </TouchableOpacity>
              </View>
            </View>
    
            {/* Product Details */}
            <View style={styles.productContainer}>
            {/* <Image 
  source={getImageSource()}
  style={styles.productImage}
  defaultSource={require('../../assets/images/placeholder.jpeg')}
  onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
  resizeMode="contain"
/> */}
<Image 
          source={{ uri: fullImageUrl }}
          style={styles.productImage}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
  resizeMode="contain"
  defaultSource={require('../../assets/images/placeholder.jpeg')}
        />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText} >-</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
    
            {/* Discount Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.discountHeader}>
                <Text style={styles.sectionTitle}>Discount</Text>
                <TouchableOpacity 
                  onPress={() => setIsModalVisible(true)}
                  style={styles.addDiscountButton}
                >
                  <Text style={styles.addDiscountText}>+ Add Discount</Text>
                </TouchableOpacity>
              </View>
              
              {discounts.length > 0 ? (
                <View style={styles.discountList}>
                  {discounts.map((discount, index) => (
                    <View key={index} style={styles.discountItem}>
                      <Text style={styles.discountText}>{discount}</Text>
                      <TouchableOpacity onPress={() => removeDiscount(discount)}>
                        <Ionicons name="close" size={16} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDiscountText}>No discounts applied</Text>
              )}
            </View>
    
            {/* Payment Method */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                {['Card', 'Cash', 'UPI'].map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentOption,
                      selectedPayment === method && styles.selectedPayment
                    ]}
                    onPress={() => setSelectedPayment(method)}
                  >
                    <Ionicons 
                      name={selectedPayment === method ? "radio-button-on" : "radio-button-off"} 
                      size={20} 
                      color="#D2691E" 
                    />
                    <Text style={styles.paymentText}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
    
            {/* Order Summary */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text>Subtotal</Text>
                <Text>{(getProductPrice() * quantity).toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Delivery Fee</Text>
                <Text>{selectedTab === 'Deliver' ? '1.00' : 'FREE'}</Text>
              </View>
              {discounts.includes("🎉 Free Delivery") && selectedTab === 'Deliver' && (
                <View style={[styles.summaryRow, styles.discountApplied]}>
                  <Text>Delivery Discount</Text>
                  <Text style={styles.discountText}>-1.00</Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>{calculateTotal()}</Text>
              </View>
            </View>
          </ScrollView>
    
         
<View style={styles.footer}>
  <View style={styles.footerContent}>
    <Text style={styles.totalAmount}>${calculateTotal()}</Text>
    <TouchableOpacity 
      style={styles.placeOrderButton}
      onPress={handlePlaceOrder}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.placeOrderText}>Place Order</Text>
      )}
    </TouchableOpacity>
  </View>
</View>
    
          {/* Discount Modal */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Available Discounts</Text>
                {availableDiscounts.map((discount, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.discountOption}
                    onPress={() => applyDiscount(discount)}
                  >
                    <Text style={styles.discountOptionText}>{discount}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    };
    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
      },
      scrollContent: {
        paddingBottom: 150, // Increased to accommodate footer
        paddingHorizontal: 16
      },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: '#D2691E'
  },
  tabText: {
    color: '#666'
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold'
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500'
  },
  subText: {
    color: 'gray',
    fontSize: 12,
    marginTop: 4
  },
  addressActions: {
    flexDirection: 'row',
    marginTop: 12
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10
  },
  actionText: {
    marginLeft: 4
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  productDescription: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 8
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2691E',
    borderRadius: 15
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#D2691E',
  },
  discountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  addDiscountButton: {
    backgroundColor: '#D2691E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15
  },
  addDiscountText: {
    color: 'white',
    fontSize: 12
  },
  discountList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  discountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F2ED',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8
  },
  discountText: {
    marginRight: 6,
    color: '#D2691E'
  },
  noDiscountText: {
    color: 'gray',
    fontStyle: 'italic'
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#D2691E',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4
  },
  selectedPayment: {
    backgroundColor: '#F9F2ED'
  },
  paymentText: {
    marginLeft: 8
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  discountApplied: {
    backgroundColor: '#F9F2ED',
    padding: 6,
    borderRadius: 6
  },
  divider: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginVertical: 8
  },
  totalRow: {
    marginTop: 8
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  placeOrderButton: {
    backgroundColor: '#D2691E',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginLeft: 'auto' // This pushes the button to the right
  },
  placeOrderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  discountOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED'
  },
  discountOptionText: {
    fontSize: 16,
    textAlign: 'center'
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#D2691E',
    padding: 12,
    borderRadius: 8
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default CheckoutScreen;