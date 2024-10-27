import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomTextInput from '../../components/common/TextInputComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SigninScreen = ({ navigation }) => {
  const [userDetail, setUserDetail] = useState({
    Email: '',
    Password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const userInput = (name, value) => {
    setUserDetail((prevValue) => ({
      ...prevValue,
      [name]: value
    }));
  };

  const handleSignin = async () => {
    const { Email, Password } = userDetail;

    setLoading(true);

    try {
      const response = await fetch('https://7b23-105-112-96-252.ngrok-free.app/api/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: Email, password: Password })
      });

      const textResponse = await response.text();

      if (!response.ok) {
        const data = JSON.parse(textResponse);

        if (response.status === 422) {
          Alert.alert("Validation Error", 'Fill in your details');
        } else if (response.status === 401) {
          Alert.alert("Authentication Error", data.errors.join(", ") || "Invalid credentials");
        } else {
          Alert.alert("Error", data.message || "An error occurred");
        }
        setLoading(false);
        return;
      }

      const data = JSON.parse(textResponse);
      const { token, user } = data;

      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert("Success", data.message);

      setTimeout(() => {
        setLoading(false); 
        navigation.replace('HomePageScreen'); 
      }, 2000);

    } catch (error) {
      console.log(error);
      
      Alert.alert("Error", "Something went wrong. Please try again");
      setLoading(false);
    }
  };

  const { container, title, subtitle, formContainer, input, signUpContainer, signUpText, signUpLink, button, buttonText } = styles;

  return (
    <SafeAreaView style={container}>
      {/* Wrap content in KeyboardAvoidingView and ScrollView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        >
          <View>
            <Text style={title}>Welcome</Text>
            <Text style={subtitle}>Please enter your email and password to sign in</Text>
          </View>
          
          <View style={formContainer}>
            <CustomTextInput
              inputstyle={input}
              placeholder='Email address'
              value={userDetail.Email}
              onChangeText={(value) => userInput('Email', value)}
              KeyboardType='email-address'
            />

            <CustomTextInput
              inputstyle={input}
              placeholder='Password'
              value={userDetail.Password}
              onChangeText={(value) => userInput('Password', value)}
              secureTextEntry
            />

            <View style={signUpContainer}>
              <Text style={signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignupScreen1')}>
                <Text style={signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#800000" />
          ) : (
            <TouchableOpacity style={button} onPress={handleSignin}>
              <Text style={buttonText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800080',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderColor: '#800080',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'rgba(128, 128, 128,0.1)'
  },
  button: {
    backgroundColor: '#800080',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLink: {
    fontSize: 16,
    color: '#800080',
    fontWeight: 'bold',
  },
});

export default SigninScreen;
