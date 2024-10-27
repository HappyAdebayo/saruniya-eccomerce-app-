import React, { useState } from 'react';
import { View,StatusBar,SafeAreaView, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // For tick mark

const SignupScreen2 = ({ route, navigation }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const { email, password } = route.params;

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleNext = () => {
    if (!selectedGender) {
      Alert.alert("Error", "Please select a gender.");
    } else {
      navigation.navigate('SignupScreen3', { email, password, gender: selectedGender });
    }
  };

  const renderGenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.genderItem}
      onPress={() => setSelectedGender(item)}
    >
      <Text style={styles.genderText}>{item}</Text>
      {selectedGender === item && (
        // <Ionicons name="checkmark" size={24} color="green" />
        <Text style={styles.genderText}>good</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Gender</Text>
      <Text style={styles.subtitle}>What is your gender?</Text>
      <FlatList
        data={genderOptions}
        renderItem={renderGenderItem}
        keyExtractor={(item) => item}
        extraData={selectedGender}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    marginTop: StatusBar.currentHeight || 0
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  genderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  genderText: {
    fontSize: 18,
    color: '#000',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupScreen2;
