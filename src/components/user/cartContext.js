import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                const user = JSON.parse(userData);

                if (!user || !user.id) {
                    return;
                }

                const cartKey = `cart_${user.id}`;
                const storedCart = await AsyncStorage.getItem(cartKey);
                const parsedCart = storedCart ? JSON.parse(storedCart) : [];
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Error loading cart items:', error);
            }
        };

        loadCartItems();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
