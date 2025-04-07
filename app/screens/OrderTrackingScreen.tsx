import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Linking,
  Image,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabaseClient";
import { SUPABASE_CONFIG } from "@/config";

const ProductImage = ({ imageUrl }) => {
  const [imgError, setImgError] = useState(false);

  if (!imageUrl || imgError) {
    return (
      <View style={[styles.productImage, styles.imagePlaceholder]}>
        <Ionicons name="image-outline" size={24} color="#D2691E" />
      </View>
    );
  }

  return (
    <Image
      source={{
        uri: imageUrl,
        cache: "force-cache",
      }}
      style={styles.productImage}
      resizeMode="contain"
      onError={() => setImgError(true)}
    />
  );
};

const OrderTrackingScreen = ({ route }) => {
  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Loading...");
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [isDelivered, setIsDelivered] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const { orderId } = route.params;

  const getImageUrl = () => {
    if (!product?.image_url) return null;
    const baseUrl = SUPABASE_CONFIG.URL.replace(/\/$/, '');
    const bucketName = "product-images";
    const imagePath = product.image_url.replace(/^\/+/, "").replace(/^product-images\/?/, "");
    return `${baseUrl}/storage/v1/object/public/${bucketName}/${imagePath}`;
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);

        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);
        setOrderStatus(orderData.status || "Preparing your order");

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", orderData.product_id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        const pickup = orderData.pickup_location || { latitude: 28.6139, longitude: 77.2090 };
        const delivery = orderData.delivery_location || { latitude: 28.4595, longitude: 77.0266 };
        setDriverLocation({ ...pickup, latitudeDelta: 0.01, longitudeDelta: 0.01 });

        generateRouteCoordinates(pickup, delivery);
        await setupLocationTracking();

      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMsg(error.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const generateRouteCoordinates = (start, end) => {
    const steps = 20;
    const coords = [];

    for (let i = 0; i <= steps; i++) {
      const fraction = i / steps;
      coords.push({
        latitude: start.latitude + (end.latitude - start.latitude) * fraction,
        longitude: start.longitude + (end.longitude - start.longitude) * fraction,
      });
    }

    setRouteCoordinates(coords);
  };

  const setupLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);

    const subscriber = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        setUserLocation(location.coords);
        checkDeliveryProximity(location.coords);
      }
    );

    return () => subscriber?.remove();
  };

  useEffect(() => {
    if (!order || !driverLocation || isDelivered || routeCoordinates.length === 0) return;

    const totalPoints = routeCoordinates.length;
    const intervalTime = (timeRemaining * 1000) / totalPoints;
    let currentPoint = 0;

    const interval = setInterval(() => {
      if (currentPoint >= totalPoints - 1) {
        clearInterval(interval);
        return;
      }

      currentPoint++;
      setDriverLocation({
        ...routeCoordinates[currentPoint],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [timeRemaining, isDelivered, order, routeCoordinates]);

  useEffect(() => {
    if (timeRemaining <= 0 || isDelivered) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDelivered(true);
          setOrderStatus("Delivered");
          updateOrderStatusInSupabase("delivered");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDelivered]);

  const updateOrderStatusInSupabase = async (status) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const checkDeliveryProximity = (coords) => {
    if (!order?.delivery_location) return;
    const distance = calculateDistance(coords, order.delivery_location);
    if (distance < 0.1 && !isDelivered) {
      setIsDelivered(true);
      setOrderStatus("Delivered");
      updateOrderStatusInSupabase("delivered");
    }
  };

  const calculateDistance = (loc1, loc2) => {
    const R = 6371;
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.latitude * Math.PI / 180) *
        Math.cos(loc2.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D2691E" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Button title="Try Again" onPress={() => fetchOrderData()} color="#D2691E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.orderCard}>
        <ProductImage imageUrl={getImageUrl()} />
        <View style={styles.orderDetails}>
          <Text style={styles.productName}>{product?.name}</Text>
          <Text style={styles.productPrice}>₹{order.unit_price * order.quantity}</Text>
          <Text style={styles.orderStatus}>{orderStatus}</Text>
          {!isDelivered && <Text style={styles.timeRemaining}>ETA: {formatTime(timeRemaining)}</Text>}
        </View>
      </View>

      {order?.pickup_location && order?.delivery_location ? (
  <MapView
    style={styles.map}
    initialRegion={{
      latitude: order.pickup_location.latitude,
      longitude: order.pickup_location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
    onMapReady={() => setMapReady(true)}
  >
    {mapReady && (
      <>
        {userLocation && <Marker coordinate={userLocation} title="You" pinColor="#3498db" />}
        <Marker coordinate={order.pickup_location} title="Pickup" pinColor="green" />
        <Marker coordinate={order.delivery_location} title="Delivery" pinColor="red" />
        {driverLocation && <Marker coordinate={driverLocation} title="Driver" pinColor="#D2691E" />}
        <Polyline coordinates={routeCoordinates} strokeColor="#D2691E" strokeWidth={4} />
      </>
    )}
  </MapView>
) : (
  <Text style={{ textAlign: 'center' }}>Loading map...</Text>
)}



      {isDelivered && (
        <View style={styles.deliverySuccess}>
          <Text style={styles.successText}>Your order has been delivered!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: 33,
    backgroundColor: '#f8f8f8',
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#D2691E",
    fontWeight: "600",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#D2691E",
  },
  deliveredStatus: {
    color: "#2ecc71",
  },
  timeRemaining: {
    fontSize: 14,
    color: "#666",
  },
  map: {
    width: '100%',
    height: 300, // Try 300 or any visible size
    borderRadius: 10,
    marginBottom: 20,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  deliverySuccess: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  successText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  markerContainer: {
    backgroundColor: '#D2691E',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default OrderTrackingScreen;
