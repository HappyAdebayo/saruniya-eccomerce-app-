// PaymentScreen.js
import React, { useState } from 'react';
import { View, Button, Text, TouchableOpacity, TextInput, Alert, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Paystack } from 'react-native-paystack';

const PaymentScreen = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const payWithPaystack = () => {
    const publicKey = 'YOUR_TEST_PUBLIC_KEY'; // Replace with your test public key

    // Validate input
    if (!email || !amount) {
      Alert.alert('Validation Error', 'Please enter all fields');
      return;
    }

    const amountInKobo = parseInt(amount);
    if (amountInKobo <= 0) {
      Alert.alert('Validation Error', 'Amount must be a positive number');
      return;
    }

    const paystackData = {
      email,
      amount: amountInKobo * 100,
      key: publicKey,
    };

    setIsLoading(true); // Set loading state

    Paystack.init({ publicKey });
    Paystack.checkout(paystackData, (response) => {
      setIsLoading(false); // Reset loading state
      if (response.status) {
        Alert.alert('Payment Successful', JSON.stringify(response));
      } else {
        Alert.alert('Payment Failed', response.message || 'Unknown error occurred');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Paystack Payment</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={payWithPaystack}
          disabled={isLoading} // Disable button when loading
        >
          <Text style={styles.buttonText}>{isLoading ? 'Processing...' : 'Pay Now'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#800080',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
  },
  input: {
    borderColor: '#800080',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
});

export default PaymentScreen;
