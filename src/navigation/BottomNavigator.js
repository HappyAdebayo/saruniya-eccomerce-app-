import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure correct import

// Screens
import HomePageScreen from "../screens/user/HomePage";
import CartScreen from "../screens/user/Cart";
import ProfileScreen from "../screens/user/Profile";
import OrderScreen from "../screens/user/Orders";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline"; 
          } else if (route.name === "Cart") {
            iconName = "cart-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline"; 
          } else if (route.name === "Orders") {
            iconName = "list-outline"; // Changed to outline variant
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#800080",
        tabBarInactiveTintColor: "gray",
        headerShown:false,
      })}
    >
      <Tab.Screen name="Home" component={HomePageScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
