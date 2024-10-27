import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, StatusBar, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';

const SignupScreen1 = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
    } else if(password.length < 8){
      Alert.alert("Error", "Password length must be greater than 8.");
    }else {
      navigation.navigate('SignupScreen2', { email, password });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}  // Hide the vertical scroll indicator
      >
        <View style={styles.form}>
          <View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Please enter your email & password to sign up.</Text>
          </View>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight || 0,
    padding: 20
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 20,
    lineHeight: 25,
  },
  label: {
    fontSize: 15,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderColor: '#800080',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(128, 128, 128,0.1)'
  },
  button: {
    backgroundColor: '#800080',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen1;
