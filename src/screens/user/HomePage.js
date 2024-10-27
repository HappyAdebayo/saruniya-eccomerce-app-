import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Image, FlatList, StatusBar, TouchableOpacity, TextInput, Keyboard, SafeAreaView, Animated, Dimensions, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window'); 

const HomePageScreen = () => {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]); 

    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('user');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Error retrieving user data from AsyncStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true); 
            try {
                const response = await fetch('https://3b30-197-211-58-111.ngrok-free.app/api/products'); // Replace with your actual API endpoint
                const productsData = await response.json();
        
                const imagesResponse = await fetch('https://3b30-197-211-58-111.ngrok-free.app/api/product-images'); // Adjust this endpoint
                const imagesData = await imagesResponse.json();
        
                const productsWithImages = productsData.map(product => {
                    const relatedImages = imagesData.filter(image => image.product_id === product.id);
                   
                    const imageUrl = relatedImages.length > 0 ? relatedImages[0].image_url : null;
        
                    return {
                        ...product,
                        image: imageUrl,
                    };
                });
        
                setProducts(productsWithImages);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false); 
            }
        };
        fetchProducts();
    }, []);
   
    const filteredProducts = selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductScreen', { product: item })}>
            {item.image &&  <Image 
    source={{ uri: `https://3b30-197-211-58-111.ngrok-free.app/storage/${item.image}` }} 
    style={styles.productImage} 
  />}
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    const carouselImages = [
        require('../../assets/discount-luggage.jpg'),
        require('../../assets/luggage-3.jpg'),
        require('../../assets/luggage-4.jpg')
    ];

    const handleScroll = (event) => {
        const index = Math.floor(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % carouselImages.length; // Cycle through images
                scrollToIndex(nextIndex);
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(interval); 
    }, []);

    const scrollToIndex = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: index * width, animated: true });  // Scroll to the next image
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading ?(
                <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
            ) :(
            <FlatList
                data={searchQuery ? searchResults : filteredProducts}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    userData ? ( // Only render if userData is loaded
                        <>
                            <View style={styles.headerSection}>
                                <View style={styles.headerRight}>
                                    <Image
                                        source={userData.image_uri ? { uri: userData.image_uri } : require('../../assets/profile-placeholder.png')} 
                                        style={styles.headerImage}
                                    />
                                    <Text style={styles.headerText}>Hi {userData.name}</Text>
                                </View>
                                <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('NotificationScreen')}>
                                    <MaterialIcons name="notifications" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>
                
                            <TextInput
                                style={styles.searchBar}
                                placeholder="Search"
                                value={searchQuery}
                                onFocus={() => navigation.navigate('SearchScreen')}
                            />
                
                            <Text style={[styles.headerText, styles.specialText]}>Special to you</Text>
                
                            {/* Carousel */}
                            <View style={styles.carouselContainer}>
                                <Animated.ScrollView
                                    horizontal
                                    pagingEnabled
                                    onScroll={handleScroll}
                                    showsHorizontalScrollIndicator={false}
                                    ref={scrollViewRef}
                                    style={styles.scrollView}
                                >
                                    {carouselImages.map((image, index) => (
                                        <View key={index} style={styles.carouselItem}>
                                            <Image source={image} style={styles.carouselImage} />
                                        </View>
                                    ))}
                                </Animated.ScrollView>
                                <View style={styles.pagination}>
                                    {carouselImages.map((_, index) => (
                                        <Text key={index} style={index === currentIndex ? styles.paginationActive : styles.paginationInactive}>
                                            •
                                        </Text>
                                    ))}
                                </View>
                            </View>
                
                            <View style={styles.filterContainer}>
                                {['All', 'luggages', 'perfumes'].map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={selectedCategory === category ? styles.selectedFilter : styles.filterButton}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <Text style={selectedCategory === category ? styles.selectedText : styles.filterText}>{category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    ) : (
                        // Loading state
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    )
                }
                
                renderItem={renderProduct}
                numColumns={2}
                columnWrapperStyle={styles.productRow}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text style={styles.noResultsText}>No products found</Text>}
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
        marginTop: StatusBar.currentHeight || 0,
        padding: 10,
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    notificationIcon: {
        marginRight: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    searchBar: {
        borderRadius: 15,
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'rgba(128, 128, 128,0.1)',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#800080',
    },
    selectedFilter: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#800080',
        borderRadius: 20,
    },
    filterText: {
        fontSize: 16,
        color: '#800080',
    },
    selectedText: {
        fontSize: 16,
        color: 'white',
    },
    specialText: {
        marginBottom: 10,
    },
    carouselContainer: {
        height: 200,
        marginBottom: 20,
        position: 'relative',
    },
    scrollView: {
        width: width, 
    },
    carouselItem: {
        width: width, 
        justifyContent: 'center',
    },
    carouselImage: {
        width: '90%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',

    },
    pagination: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    paginationActive: {
        color: '#333',
        margin: 3,
        fontSize: 18,
    },
    paginationInactive: {
        color: '#ccc',
        margin: 3,
        fontSize: 18,
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
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
        color: '#666',
    },
});

export default HomePageScreen;
