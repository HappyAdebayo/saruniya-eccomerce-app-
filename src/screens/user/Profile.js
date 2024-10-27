import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, StatusBar, FlatList, Switch, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, SafeAreaView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons

const ProfileScreen = ({ navigation }) => {
  const [expandedSection, setExpandedSection] = useState(null); // Track the expanded section
  const sectionHeight = useRef(new Animated.Value(0)).current; // Single animated value
  const [userInfo, setUserInfo] = useState(null); // User information state

  useEffect(() => {
    // Load user info from AsyncStorage on mount
    const loadUserInfo = async () => {
      try {
        const user = await AsyncStorage.getItem('user'); // Assuming 'user' contains user info
        if (user) {
          setUserInfo(JSON.parse(user));
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };
    loadUserInfo();
  }, []);


  // Profile menu data
  const menuData = [
    { id: '1', title: 'Notifications', icon: 'notifications-outline' },
    { id: '2', title: 'Language', icon: 'language-outline', description: 'English (US)' },
    { id: '4', title: 'About', icon: 'information-circle-outline', content: 'This is the About section. Here you can put any information about the app or the user.' },
    { id: '5', title: 'Privacy Policy', icon: 'lock-closed-outline', content: 'This is the Privacy Policy section. Here you can put any information about the privacy policy.' },
    { id: '6', title: 'Logout', icon: 'exit-outline' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
      <Ionicons name={item.icon} size={24} color="#333" style={styles.icon} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{item.title}</Text>
        {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
      </View>
      {item.isSwitch ? (
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      ) : null}
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    if (item.title === 'About' || item.title === 'Privacy Policy') {
      toggleSection(item);
    } else if (item.title === 'Logout') {
      handleLogout();
    } else if(item.title === 'Notifications'){
       navigation.navigate('NotificationScreen')
    } else{
      alert(`You selected ${item.title}`);
    }
  };

  const toggleSection = (item) => {
    const isExpanding = expandedSection !== item.id;
    const finalHeight = isExpanding ? 100 : 0;

    Animated.timing(sectionHeight, {
      toValue: finalHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpandedSection(isExpanding ? item.id : null);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user'); // Remove user data from AsyncStorage
              navigation.replace('SignInScreen'); // Navigate to Sign-in screen
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
        <Image
          source={userInfo?.image_uri ? { uri: userInfo.image_uri } : require('../../assets/profile-placeholder.png')}
          style={styles.profileImage}
        />
      </View>

      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
          <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
        </View>
      )}

      <View style={styles.listContainer}>
        <FlatList
          data={menuData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>

      {expandedSection && (
        <TouchableWithoutFeedback onPress={() => toggleSection(menuData.find(item => item.id === expandedSection))}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.section, { height: sectionHeight }]}>
        {expandedSection && (
          <Text style={styles.sectionText}>
            {menuData.find(item => item.id === expandedSection)?.content}
          </Text>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    marginTop: StatusBar.currentHeight || 0
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#333',
  },
  listContainer: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(128, 128, 128,0.1)',
    marginBottom: 10,
    borderRadius: 10,
  },
  icon: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black'
  },
  itemDescription: {
    fontSize: 14,
    color: 'black',
  },
  section: {
    overflow: 'hidden',
    backgroundColor: 'white',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
});

export default ProfileScreen;
