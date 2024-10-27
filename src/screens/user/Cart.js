import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, StatusBar, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from "../../components/user/cartContext";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
    const { cartItems, setCartItems } = useContext(CartContext); 
    const [shippingAddress, setShippingAddress] = useState('');
    const navigation = useNavigation()
    
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                const user = JSON.parse(userData);
        
                if (!user || !user.id) {
                    alert('User is not logged in');
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
    }, [setCartItems]); 

    // CART Checkout

    const handleCheckout = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            const user = JSON.parse(userData);
    
            if (!user || !user.id) {
                alert('User is not logged in');
                return;
            }

            const checkoutData = {
                user_id: user.id,
                shipping_address: shippingAddress,
                total_price: totalPrice,
                product_details: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price.replace(/₦|,/g, '').trim(),
                })),
            };
    
            const response = await fetch('https://eab4-105-112-102-102.ngrok-free.app/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutData)
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert('Checkout successful!');
                setCartItems([]);
                await AsyncStorage.removeItem(`cart_${user.id}`);
            } else {
                alert('Checkout failed. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout. Please try again.');
        }
    };
    

    const totalPrice = cartItems.reduce((total, item) => {
        const priceString = item.price.replace(/₦|,/g, '').trim();
        const price = parseFloat(priceString) || 0;
        const quantity = parseInt(item.quantity, 10) || 0; 
        return total + (price * quantity);
    }, 0);

    const handleRemoveItem = (itemId) => {
        const updatedCartItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCartItems); 
        AsyncStorage.setItem(`cart_${itemId}`, JSON.stringify(updatedCartItems)); 
    };

    const renderCartItem = ({ item }) => {
        const imageSource = typeof item.image === 'string' ? { uri: `https://eab4-105-112-102-102.ngrok-free.app/storage/${item.image}` } : item.image; 
        
        return (
            <View style={styles.cartItem}>
                <TouchableOpacity style={styles.cont}  onPress={() => navigation.navigate('ProductScreen', { product: item })}>
                <Image 
                    source={imageSource || { uri: 'https://via.placeholder.com/80' }} 
                    style={styles.productImage} 
                    onError={(error) => console.log('Image load error:', error.nativeEvent.error)} 
                />
                <View style={styles.itemDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price.toLocaleString()}</Text>
                    <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(item.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your Cart</Text>
            
           
            <View style={styles.shippingAddressContainer}>
                <Text style={styles.shippingAddressLabel}>Shipping Address</Text>
                <TextInput 
                    style={styles.shippingAddressInput} 
                    placeholder="Enter your shipping address"
                    value={shippingAddress}
                    onChangeText={setShippingAddress}
                    multiline={true}
                />
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
                contentContainerStyle={styles.cartList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyCartText}>No products in cart! 😊</Text>}
            />
            {cartItems.length > 0 && (
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total: {totalPrice.toLocaleString()}</Text>
                </View>
            )}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        marginTop: StatusBar.currentHeight || 0
    },
    
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
    },
    shippingAddressContainer: {
        marginBottom: 20,
    },
    shippingAddressLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
    },
    shippingAddressInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        height: 80, // Adjust height as needed
        textAlignVertical: 'top', // Start text at the top
    },
    cartList: {
        flexGrow: 1,
    },
    cartItem: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        marginBottom: 10,
        borderRadius: 20
    },
    cont:{
        flex:1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
        // width:'100%'
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    productName: {
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
    },
    productPrice: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    productQuantity: {
        fontSize: 14,
        color: 'black',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#800080',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    totalContainer: {
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#800080',
    },
    emptyCartText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
        color: '#666',
    },
    checkoutButton: {
        backgroundColor: '#800080',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CartScreen;
