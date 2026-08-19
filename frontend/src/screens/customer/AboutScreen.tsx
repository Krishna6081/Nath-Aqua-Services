import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { GradientHeader } from '../../components/common/GradientHeader';

export const AboutScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <GradientHeader title="About Nath Water Service" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 64, marginBottom: 12 }}>💧</Text>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#0f172a' }}>
              Nath Water Service
            </Text>
            <Text variant="bodySmall" style={{ color: '#0284c7', fontWeight: 'bold', marginBottom: 12 }}>
              Version 1.0.0 (Build 2026)
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#475569', lineHeight: 22 }}>
              Nath Water Service is a premier commercial water supply and delivery platform.
              We provide pure 20L dispenser water cans and heavy municipal water tankers for residential and commercial premises.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
  },
});
