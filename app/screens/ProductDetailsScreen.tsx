// import React, { useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";

// const ProductDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { product } = route.params;
//   const [selectedSize, setSelectedSize] = useState("M");

//   const sizeImages = {
//     S: require("../../assets/images/small1.webp"),
//     M: require("../../assets/images/medium1.webp"),
//     L: require("../../assets/images/large11.webp"),
//   };

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         {/* Header with Back Button */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="black" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Detail</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("CheckoutDetails",{product})}>
//     <Ionicons name="heart-outline" size={24} color="black" />
// </TouchableOpacity>


//         </View>

//         {/* Product Image (Main Display) */}
//         <View style={styles.imageContainer}>
//         <Image source={product.Image} style={styles.image} />
//       </View>

//         {/* Product Info */}
//         <Text style={styles.name}>{product.name}</Text>
//         <Text style={styles.subtext}>Ice/Hot</Text>

//         {/* Rating */}
//         <View style={styles.ratingContainer}>
//           <Ionicons name="star" size={18} color="#FFD700" />
//           <Text style={styles.ratingText}>4.8 (230)</Text>
//         </View>

//         {/* Description */}
//         <Text style={styles.sectionTitle}>Description</Text>
//         <Text style={styles.description}>
//           A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of
//           espresso coffee and 85ml of fresh milk...{" "}
//           <Text style={styles.readMore}>Read More</Text>
//         </Text>

//         {/* Size Selection */}
//         <Text style={styles.sectionTitle}>Available Sizes</Text>
//         <View style={styles.sizeContainer}>
//           {["S", "M", "L"].map((size) => (
//             <TouchableOpacity
//               key={size}
//               style={[
//                 styles.sizeButton,
//                 selectedSize === size && styles.activeSize,
//               ]}
//               onPress={() => setSelectedSize(size)}
//             >
//               <Image source={sizeImages[size]} style={styles.sizeImage} />
//               <Text
//                 style={[
//                   styles.sizeText,
//                   selectedSize === size && styles.activeSizeText,
//                 ]}
//               >
//                 {size}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Footer Section */}
//         <View style={styles.footer}>
//           {/* Price Section */}
//           <View style={styles.priceContainer}>
//             <Text style={styles.priceLabel}>Price</Text>
//             <Text style={styles.priceValue}>{product.price}</Text>
//           </View>

//           {/* Buy Now Button */}
//           <TouchableOpacity
//             style={styles.buyButton}
//             onPress={() => navigation.navigate("CheckoutDetails", { product })}
//           >
//             <Text style={styles.buyButtonText}>Buy Now</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   imageContainer: {
//     width: "100%",
//     height: 290,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 10,
//   },

//   name: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#313131",
//     marginTop: 10,
//   },
//   subtext: {
//     color: "#A3A3A3",
//     fontSize: 14,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 5,
//   },
//   ratingText: {
//     marginLeft: 5,
//     fontSize: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 15,
//     color: "#131313",
//   },
//   description: {
//     color: "gray",
//     fontSize: 14,
//     marginTop: 5,
//   },
//   readMore: {
//     color: "#D2691E",
//     fontWeight: "bold",
//   },
//   sizeContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   sizeButton: {
//     alignItems: "center",
//     marginHorizontal: 10,
//     padding: 10,
//     borderWidth: 1,
    
//     borderRadius: 10,
//   },
//   activeSize: {
//     backgroundColor: "#F9F2ED",
//     borderColor: "#D2691E",
//   },
//   sizeImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//   },
//   sizeText: {
//     fontSize: 16,
//     color: "black",
//     marginTop: 5,
//   },
//   activeSizeText: {
//     color: "#D2691E",
//     fontWeight: "bold",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 20,
//     padding: 16,
//     backgroundColor: "white",
//     borderRadius: 10,
//   },
//   priceContainer: {
//     flexDirection: "column",
//     alignItems: "flex-start",
//   },
//   priceLabel: {
//     fontSize: 14,
//     color: "#A3A3A3",
//   },
//   priceValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#D2691E",
//   },
//   buyButton: {
//     backgroundColor: "#D2691E",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   buyButtonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default ProductDetailsScreen;


import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SUPABASE_CONFIG } from "../../../MyApp/config";

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState("M");
  const [imageLoading, setImageLoading] = useState(true);

  
  const fullImageUrl = `${SUPABASE_CONFIG.URL}/${SUPABASE_CONFIG.STORAGE_PATH}/${product.image_url}`;

  const sizeImages = {
    S: require("../../assets/images/small1.webp"),
    M: require("../../assets/images/medium1.webp"),
    L: require("../../assets/images/large11.webp"),
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CheckoutDetails", { product })}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Product Image with Loading Indicator */}
      <View style={styles.imageContainer}>
        {imageLoading && (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#D2691E" />
        )}
        <Image 
          source={{ uri: fullImageUrl }}
          style={styles.image}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            console.log('Failed to load image:', fullImageUrl);
            setImageLoading(false);
          }}
        />
      </View>

      {/* Product Info */}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.subtext}>{product.description || 'Ice/Hot'}</Text>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={18} color="#FFD700" />
        <Text style={styles.ratingText}>{product.rating || '4.8'} (230)</Text>
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {product.long_description || 'A cappuccino is an approximately 150 ml (5 oz) beverage...'}
        {product.long_description && (
          <Text style={styles.readMore}> Read More</Text>
        )}
      </Text>

      {/* Size Selection */}
      <Text style={styles.sectionTitle}>Available Sizes</Text>
      <View style={styles.sizeContainer}>
        {["S", "M", "L"].map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeButton,
              selectedSize === size && styles.activeSize,
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Image source={sizeImages[size]} style={styles.sizeImage} />
            <Text
              style={[
                styles.sizeText,
                selectedSize === size && styles.activeSizeText,
              ]}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{product.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate("CheckoutDetails", { 
            product: {
              ...product,
              selectedSize
            } 
          })}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: 290,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden'
  },
  loadingIndicator: {
    position: 'absolute',
    zIndex: 1
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#313131",
    marginTop: 10,
  },
  subtext: {
    color: "#A3A3A3",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    color: "#131313",
  },
  description: {
    color: "gray",
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20
  },
  readMore: {
    color: "#D2691E",
    fontWeight: "bold",
  },
  sizeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  sizeButton: {
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
  },
  activeSize: {
    backgroundColor: "#F9F2ED",
    borderColor: "#D2691E",
  },
  sizeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  sizeText: {
    fontSize: 16,
    color: "black",
    marginTop: 5,
  },
  activeSizeText: {
    color: "#D2691E",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  priceLabel: {
    fontSize: 14,
    color: "#A3A3A3",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D2691E",
  },
  buyButton: {
    backgroundColor: "#D2691E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;