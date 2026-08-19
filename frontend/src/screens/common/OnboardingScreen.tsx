import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    icon: '💧',
    title: 'Pure Water Delivered to Your Door',
    description: 'Hygienically packaged 20L cans and municipal water tankers delivered directly to your doorstep.',
  },
  {
    icon: '⚡',
    title: 'Easy & Fast Water Ordering',
    description: 'Order in less than 30 seconds with real-time location tracking and instant delivery updates.',
  },
  {
    icon: '📅',
    title: 'Schedule Regular Water Delivery',
    description: 'Set up recurring subscriptions daily or weekly without worrying about ordering manually.',
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const currentItem = onboardingData[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topContainer}>
        <Text style={styles.icon}>{currentItem.icon}</Text>
        <Text variant="headlineMedium" style={styles.title}>
          {currentItem.title}
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          {currentItem.description}
        </Text>
      </View>

      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.colors.primary : '#cbd5e1',
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.bottomContainer}>
        {currentIndex < onboardingData.length - 1 ? (
          <>
            <Button mode="text" onPress={() => navigation.replace('Login')}>
              Skip
            </Button>
            <Button mode="contained" onPress={handleNext} style={styles.button}>
              Next
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={() => navigation.replace('Login')} style={[styles.button, { flex: 1 }]}>
            Get Started
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 90,
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
  },
  description: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 12,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: 25,
    paddingHorizontal: 16,
  },
});
