import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StatusBar, SafeAreaView, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../../components/user/cartContext';

const { width } = Dimensions.get('window');

const ProductDescriptionScreen = ({ route }) => {
    const { product } = route.params;
    const { cartItems, setCartItems } = useContext(CartContext);
    const [quantity, setQuantity] = useState(0);
    const baseUrl = 'https://3b30-197-211-58-111.ngrok-free.app/storage/';
    

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            slideNextImage();
        }, 3000); 

        return () => {
            clearInterval(slideInterval); 
        };
    }, [currentIndex]);

    const slideNextImage = () => {
        if (currentIndex < product.images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); 
        }

        flatListRef.current.scrollToIndex({
            index: currentIndex,
            animated: true,
        });
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };
    

    const addToCart = async () => {
        if (quantity === 0) {
            alert('Please select a quantity to add to cart.');
            return;
        }
    
        try {
            const userData = await AsyncStorage.getItem('user');
            const user = JSON.parse(userData);
    
            if (!user || !user.id) {
                alert('User is not logged in');
                return;
            }
    
            const cartKey = `cart_${user.id}`;
            const storedCart = await AsyncStorage.getItem(cartKey);
            const cart = storedCart ? JSON.parse(storedCart) : [];
    
            // Using product.id instead of product.images[0].product_id
            const existingProductIndex = cart.findIndex(item => item.id === product.id);
            let updatedCart;
    
            if (existingProductIndex !== -1) {
                updatedCart = [...cart];
                updatedCart[existingProductIndex].quantity += quantity;
            } else {
                updatedCart = [...cart, { ...product, quantity }];
            }
    
            setCartItems(updatedCart);
            await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
            alert('Product added to cart!');
    
            // Post product to backend using product.id
            const response = await fetch('https://3b30-197-211-58-111.ngrok-free.app/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: quantity,
                    name: product.name,
                    user_id: user.id,
                    product_id: product.id  // Use the product.id directly here
                }),
            });
    
            const contentType = response.headers.get('content-type');
    
            if (response.status === 302) {
                const location = response.headers.get('Location');
                console.warn('Redirect detected to:', location);
                throw new Error(`Server redirected to ${location}`);
            }
    
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Expected JSON, but got non-JSON response from the server');
            }
    
            const data = await response.json();
    
        } catch (error) {
            console.error('Error adding product to cart:', error.message);
        }
    };
    
    
    

    const renderImageItem = ({ item }) => (
        <Image
            source={{ uri: `${baseUrl}${item.image_url}` }}
            style={styles.productImage}
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                
                {/* Carousel using FlatList */}
                <FlatList
                    data={product.images}
                    ref={flatListRef}
                    horizontal
                    pagingEnabled
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderImageItem}
                    showsHorizontalScrollIndicator={false}
                    onScrollToIndexFailed={() => {}}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(newIndex);
                    }}
                />

                <View style={styles.detailsContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price.toLocaleString()}</Text>
                    <Text style={styles.productDescription}>{product.description}</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityNumber}>{quantity}</Text>
                        <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: StatusBar.currentHeight || 0,
    },
    container: {
        flexGrow: 1,
    },
    productImage: {
        width: width,
        height: 300,
        marginBottom: 20,
        resizeMode: 'cover',
        marginRight: 10,
    },
    detailsContainer: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 15,
    },
    productDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
        marginBottom: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityButton: {
        backgroundColor: '#800080',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        width: 40,
        textAlign: 'center',
    },
    addToCartButton: {
        backgroundColor: '#800080',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDescriptionScreen;
