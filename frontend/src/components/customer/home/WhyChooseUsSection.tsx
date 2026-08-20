import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const WhyChooseUsSection: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      id: 'pure',
      title: 'Pure & Clean',
      desc: 'Quality water you can trust',
      icon: 'water-check',
      bgColor: '#e0f2fe',
      iconColor: '#0284c7',
    },
    {
      id: 'fast',
      title: 'Fast Delivery',
      desc: 'Reliable delivery at your doorstep',
      icon: 'truck-fast',
      bgColor: '#cffaff',
      iconColor: '#0891b2',
    },
    {
      id: 'ontime',
      title: 'On-Time Service',
      desc: 'Water when you need it',
      icon: 'clock-check-outline',
      bgColor: '#dbeafe',
      iconColor: '#2563eb',
    },
    {
      id: 'trusted',
      title: 'Trusted Service',
      desc: 'Reliable service for homes & businesses',
      icon: 'shield-decagram',
      bgColor: '#d1fae5',
      iconColor: '#059669',
    },
  ];

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        Why Choose Nath Water Service?
      </Text>

      <View style={styles.grid}>
        {features.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
              <Icon name={item.icon} size={24} color={item.iconColor} />
            </View>
            <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={styles.desc}>
              {item.desc}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 26,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
  desc: {
    color: '#64748b',
    fontSize: 11,
    lineHeight: 16,
  },
});
