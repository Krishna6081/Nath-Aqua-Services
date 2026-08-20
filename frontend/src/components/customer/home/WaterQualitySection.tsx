import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

export const WaterQualitySection: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: '#f0f9ff' }]}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Icon name="check-decagram" size={14} color="#0284c7" />
            <Text style={styles.badgeText}>PURE HYGIENE ASSURED</Text>
          </View>

          <Text variant="headlineSmall" style={styles.title}>
            Clean Water.{'\n'}
            <Text style={{ color: '#0284c7' }}>Better Living.</Text>
          </Text>

          <Text variant="bodyMedium" style={styles.subtext}>
            We are committed to delivering clean, safe and reliable water to your doorstep through multi-stage purification and strict quality checks.
          </Text>

          <View style={styles.pointsGrid}>
            <View style={styles.pointItem}>
              <Icon name="filter-variant" size={16} color="#0284c7" />
              <Text style={styles.pointText}>7-Stage RO Filtered</Text>
            </View>
            <View style={styles.pointItem}>
              <Icon name="shield-sun" size={16} color="#0284c7" />
              <Text style={styles.pointText}>UV Sterilized Cans</Text>
            </View>
          </View>
        </View>

        <View style={styles.visualColumn}>
          <View style={styles.dropGraphic}>
            <Text style={{ fontSize: 44 }}>💧</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 26,
  },
  card: {
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
    elevation: 2,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  content: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 28,
  },
  subtext: {
    color: '#475569',
    marginTop: 6,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 19,
  },
  pointsGrid: {
    gap: 6,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  visualColumn: {
    marginLeft: 12,
  },
  dropGraphic: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#e0f2fe',
  },
});
