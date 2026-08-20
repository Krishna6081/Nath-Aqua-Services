import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface HomeCTASectionProps {
  onOrderNow: () => void;
}

export const HomeCTASection: React.FC<HomeCTASectionProps> = ({ onOrderNow }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: '#0284c7' }]}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>
            Need Water Today? 🚰
          </Text>

          <Text variant="bodyMedium" style={styles.subtext}>
            Place your order in just a few taps and get fast express delivery.
          </Text>

          <Button
            mode="contained"
            buttonColor="#ffffff"
            textColor="#0284c7"
            style={styles.button}
            contentStyle={{ height: 44, paddingHorizontal: 16 }}
            labelStyle={{ fontWeight: '800', fontSize: 13 }}
            icon="truck-fast"
            onPress={onOrderNow}
          >
            ORDER WATER NOW
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 16,
  },
  card: {
    borderRadius: 22,
    padding: 22,
    elevation: 4,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    color: '#ffffff',
    fontWeight: '900',
    textAlign: 'center',
  },
  subtext: {
    color: '#e0f2fe',
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
    maxWidth: '85%',
  },
  button: {
    borderRadius: 16,
  },
});
