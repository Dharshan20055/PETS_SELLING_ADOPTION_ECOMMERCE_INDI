import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    
    if (!user || !user.id) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      const res = await cartAPI.getCart(user.id);
      const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
      setCartItems(items);
      setCartCount(items.length);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (petId) => {
    try {
      await cartAPI.addToCart(petId);
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context || {}; 
};

export default CartContext;