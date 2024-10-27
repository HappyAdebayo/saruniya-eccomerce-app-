import React, { useEffect } from "react";
import { View, Image, Text, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({navigation}) => {
    const { container, logoText, logo } = styles;

  

      useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const userData = await AsyncStorage.getItem('user'); // Retrieve user data from AsyncStorage
                const user = JSON.parse(userData);

                if (user && user.id) {
                    navigation.replace('HomePageScreen');
                } else {
                    navigation.replace('OnboardingScreen');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                navigation.replace('OnboardingScreen');
            }
        };

        setTimeout(() => {
            checkLoginStatus();
        }, 2000);
    }, [navigation]);
    return (
        <SafeAreaView style={container}>
            <Image
               source={require('../../assets/logo.png')}
               style={logo} 
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    padding: 20,
        alignItems: 'center',
        marginTop: StatusBar.currentHeight || 0,
        // backgroundColor: '#800000', // Maroon background
    },
    logoText: {
        fontSize: 28,
        color: '#FFFFFF', // White text
        fontFamily: 'Montserrat-Bold', 
        marginBottom: 20, // Space between text and image
    },
    logo: {
        width: 150, // Set the width of the image
        height: 150, // Set the height of the image
        resizeMode: 'contain', // Adjust the image within its container
    }
});

export default SplashScreen;
