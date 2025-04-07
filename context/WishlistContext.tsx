import React, { createContext, useState, useContext, ReactNode } from 'react';

type Product = {
  id: string;
  name: string;
  // other product properties
};

type WishlistContextType = {
  wishlist: Product[];
  toggleWishlist: (item: Product) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const toggleWishlist = (item: Product) => {
    setWishlist(prev => {
      const isItemInWishlist = prev.some(w => w.id === item.id);
      return isItemInWishlist
        ? prev.filter(w => w.id !== item.id)
        : [...prev, item];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};