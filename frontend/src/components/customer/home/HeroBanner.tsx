import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface HeroBannerProps {
  onOrderPress: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOrderPress }) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Icon name="shield-check" size={14} color="#0284c7" />
            <Text style={styles.badgeText}>100% Pure & Hygienic</Text>
          </View>
          <View style={styles.expressBadge}>
            <Icon name="truck-fast" size={14} color="#059669" />
            <Text style={styles.expressText}>30-Min Express</Text>
          </View>
        </View>

        <Text variant="headlineSmall" style={styles.headline}>
          Pure Water,{'\n'}
          <Text style={{ color: theme.colors.primary }}>Delivered to Your Door.</Text>
        </Text>

        <Text variant="bodyMedium" style={styles.subtext}>
          Fresh, reliable and convenient water delivery whenever you need it.
        </Text>

        <View style={styles.ctaRow}>
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={{ paddingHorizontal: 16, height: 44 }}
            labelStyle={{ fontWeight: '700', fontSize: 14 }}
            icon="water"
            onPress={onOrderPress}
          >
            Order Water
          </Button>

          <View style={styles.graphicCircle}>
            <Text style={{ fontSize: 34 }}>💧</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 22,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.15)',
  },
  content: {
    padding: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369a1',
  },
  expressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  expressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  headline: {
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  subtext: {
    color: '#64748b',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 14,
    backgroundColor: '#0284c7',
  },
  graphicCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bae6fd',
  },
});
