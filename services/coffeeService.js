// services/coffeeService.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getCoffeeProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'coffeeProducts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching coffee products: ", error);
    return [];
  }
};