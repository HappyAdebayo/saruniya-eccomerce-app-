import React, { useState } from 'react';
import { View, SafeAreaView, ActivityIndicator, StatusBar, Text, TextInput, Alert, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen3 = ({ route, navigation }) => {
  const { email, password, gender } = route.params;
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [imageUri, setImageUri] = useState(null); 
  const [loading, setLoading] = useState(false);
   
  const handleNav = () => {
    navigation.replace('HomePageScreen');
  }
  
  const handleSubmit = async () => {
    if (!name || !phoneNumber) {
      Alert.alert("Error", "Please fill out all the required fields.");
    } else {
      
      setLoading(true); 
      
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('gender', gender);
      formData.append('name', name);
      formData.append('phone_number', phoneNumber);
      formData.append('date_of_birth', dateOfBirth || null);

      if (imageUri) {
        const fileName = imageUri.split('/').pop(); 
        const fileType = fileName.split('.').pop(); 
        formData.append('image_uri', {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      try {
        const response = await fetch('https://3b30-197-211-58-111.ngrok-free.app/api/register', {
          method: "POST",
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const textResponse = await response.text();
        const data = JSON.parse(textResponse);

        if (!response.ok) {
          if (response.status === 422) {
            const errorMessage = data.errors
              ? Object.values(data.errors).flat().join(", ")
              : data.message || "An error occurred";
            Alert.alert("Validation Error", errorMessage);
          } else {
            Alert.alert("Error", data.message || "An error occurred");
          }
        } else {
          const { token, user } = data;

          await AsyncStorage.setItem('authToken', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));

          Alert.alert("Success", data.message);

          setTimeout(() => {
            setLoading(false);
            navigation.replace('HomePageScreen');
          }, 2000);
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again");
      } finally {
        setLoading(false)
      }
    }
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setImageUri(selectedImageUri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputcontainer}>
            <Text style={styles.subtitle}>Personal information</Text>
            
            <TouchableOpacity onPress={selectImage}>
              <Image
                source={imageUri ? { uri: imageUri } : require('../../assets/profile-placeholder.png')}
                style={styles.image}
              />
            </TouchableOpacity>

            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <Text style={styles.label}>Date of Birth (Optional):</Text>
            <TextInput
              placeholder="Date of birth (YYYY-MM-DD)"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              style={styles.input}
            />
          </View>

          {/* Display loading indicator when loading is true */}
          {loading ? (
            <ActivityIndicator size="large" color="#800080" style={{ marginBottom: 20 }} />
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleNav}>
                <Text style={styles.buttonText}>Submission</Text>
              </TouchableOpacity>
            </>
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
    marginTop: StatusBar.currentHeight || 0,
  },
  inputcontainer: {
    flex: 1,
  },
  image: {
    width: 150, 
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 75,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupScreen3;
