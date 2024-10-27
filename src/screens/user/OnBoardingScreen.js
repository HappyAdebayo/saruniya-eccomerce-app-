import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet, StatusBar, Dimensions, SafeAreaView, Image } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
    { 
      id: '1', 
      title: 'Discover Luxury Travel Gear', 
      description: 'Explore our premium luggage collection, designed to make every journey smooth and stylish.', 
      image: require('../../assets/luggage-1.jpg') 
    },
    { 
      id: '2', 
      title: 'Stay Organized on the Go', 
      description: 'Track your travels with durable, feature-packed luggage that keeps you prepared for any adventure.', 
      image: require('../../assets/luggage-2.jpg') 
    },
    { 
      id: '3', 
      title: 'Fragrances That Inspire', 
      description: 'Enhance your presence with our exclusive perfume collection, perfect for any occasion.', 
      image: require('../../assets/perfume-3.jpg') 
    },
    { 
      id: '4', 
      title: 'Get Ready to Elevate Your Experience!', 
      description: 'Sign up now to unlock exclusive access to the finest luggage and perfumes for your journey.', 
      image: require('../../assets/perfume-1.jpg') 
    },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef(null);

  // Function to update slide index when swiped
  const updateSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(newIndex);
  };

  // Function to scroll to the next slide
  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current?.scrollToOffset({ offset, animated: true });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  // Render each slide with image
  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateSlideIndex}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        snapToInterval={width}
        decelerationRate="fast"
      />

      {currentSlideIndex === slides.length - 1 ? (
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('SignInScreen')}>
            <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
            <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.indicatorsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlideIndex === index ? styles.activeIndicator : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textContainer: {
    width: width - 60, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center', 
  },
  description: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
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
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#800080',
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(128, 128, 128,0.1)'

  },
});

export default OnboardingScreen;
