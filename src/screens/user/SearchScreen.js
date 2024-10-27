import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, TextInput, FlatList, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import noProductImage from "../../assets/smiley.png";

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [products, setProducts] = useState([]); // State to hold fetched products

    // Function to fetch products from backend
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://3b30-197-211-58-111.ngrok-free.app/api/products'); // Replace with your backend URL
            const data = await response.json();

            // Assuming data is an array of products where each product has an image ID
            // You may need to modify this according to your backend response
            const productsWithImages = data.map(product => ({
                ...product,
                // Replace this with how you construct the image URL based on your backend setup
                image: `https://your-backend-url/images/${product.imageId}.png`, // Adjust as necessary
            }));

            setProducts(productsWithImages); // Set the products with image URLs
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts(); // Fetch products on component mount
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
        const results = products.filter(product =>
            product.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.productCard} onPress={() => alert(`Selected: ${item.name}`)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for products..."
                value={searchQuery}
                onChangeText={handleSearch}
                returnKeyType="search"
                autoFocus
            />

            {searchQuery.length > 0 && searchResults.length === 0 ? (
                <View style={styles.noResultsContainer}>
                    <Image source={noProductImage} style={styles.noResultsImage} />
                    <Text style={styles.noResultsText}>Not Found</Text>
                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id.toString()} // Ensure id is a string
                    renderItem={renderProduct}
                    numColumns={2}
                    columnWrapperStyle={styles.productRow}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        marginTop: StatusBar.currentHeight || 0,
    },
    searchBar: {
        borderRadius: 15,
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'rgba(128, 128, 128,0.1)',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    noResultsImage: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    noResultsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    productRow: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 5,
        padding: 10,
        elevation: 3,
        width: '48%',
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginBottom: 5,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
    },
    productPrice: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
    },
});

export default SearchScreen;
