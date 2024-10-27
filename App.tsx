import React from "react";
import { View, Text, StyleSheet,SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import SplashScreen from "./src/screens/shared/SplashScreen";
import OnboardingScreen from "./src/screens/user/OnBoardingScreen";
import SigninScreen from "./src/screens/shared/SigninScreen";
import SignupScreen1 from "./src/screens/user/SignupScreen1";
import SignupScreen2 from "./src/screens/user/SignupScreen2";
import SignupScreen3 from "./src/screens/user/SignupScreen3";
import SearchScreen from "./src/screens/user/SearchScreen";
import NotificationScreen from "./src/screens/shared/NotificationScreen";
import OrderScreen from "./src/screens/user/Orders";
import ProductDescriptionScreen from "./src/screens/user/ProductDescriptionScreen";
import PaymentScreen from "./src/screens/user/paymentGateway";

import BottomTabNavigator from "./src/navigation/BottomNavigator";
import { CartProvider } from "./src/components/user/cartContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App=()=>{
  return(
    <CartProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="SignInScreen" component={SigninScreen} />
        <Stack.Screen name="HomePageScreen" component={BottomTabNavigator} />
        <Stack.Screen name="SignupScreen1" component={SignupScreen1} options={{ title: 'Step 1' }} />
        <Stack.Screen name="SignupScreen2" component={SignupScreen2} options={{ title: 'Step 2' }} />
        <Stack.Screen name="SignupScreen3" component={SignupScreen3} options={{ title: 'Step 3' }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="ProductScreen" component={ProductDescriptionScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  )
}
const styles= StyleSheet.create({
 container:{flex:1}
})
export default App