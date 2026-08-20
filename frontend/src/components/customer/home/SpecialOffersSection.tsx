import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Coupon } from '../../../types';

interface SpecialOffersSectionProps {
  coupons?: Coupon[];
  onOrderNow: (couponCode?: string) => void;
}

export const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  coupons = [],
  onOrderNow,
}) => {
  const theme = useTheme();

  const defaultOffers = [
    {
      id: 'offer-1',
      code: 'PURE10',
      title: '10% OFF',
      subtitle: 'On your next water order',
      badge: 'POPULAR',
      bgColor: '#e0f2fe',
      accentColor: '#0284c7',
    },
    {
      id: 'offer-2',
      code: 'FRESH50',
      title: 'FLAT ₹50 OFF',
      subtitle: 'On Water Tanker bookings',
      badge: 'EXPRESS',
      bgColor: '#cffaff',
      accentColor: '#0891b2',
    },
  ];

  const offersToRender = coupons.length > 0
    ? coupons.map((c, i) => ({
        id: c.id,
        code: c.code,
        title: c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`,
        subtitle: `Min order ₹${c.minOrderAmount}`,
        badge: 'OFFER',
        bgColor: i % 2 === 0 ? '#e0f2fe' : '#cffaff',
        accentColor: i % 2 === 0 ? '#0284c7' : '#0891b2',
      }))
    : defaultOffers;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Special Offers
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
          Swipe to explore
        </Text>
      </View>

      <FlatList
        data={offersToRender}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: item.bgColor }]}
            onPress={() => onOrderNow(item.code)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: item.accentColor }]}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
              <View style={styles.codePill}>
                <Icon name="ticket-percent" size={14} color={item.accentColor} />
                <Text style={[styles.codeText, { color: item.accentColor }]}>{item.code}</Text>
              </View>
            </View>

            <Text variant="headlineSmall" style={[styles.offerTitle, { color: item.accentColor }]}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={styles.offerSubtitle}>
              {item.subtitle}
            </Text>

            <Button
              mode="contained"
              compact
              style={[styles.orderBtn, { backgroundColor: item.accentColor }]}
              labelStyle={{ fontSize: 11, fontWeight: '700' }}
              onPress={() => onOrderNow(item.code)}
            >
              Order Now
            </Button>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 220,
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  offerTitle: {
    fontWeight: '900',
    marginTop: 4,
  },
  offerSubtitle: {
    color: '#334155',
    marginTop: 2,
    marginBottom: 14,
  },
  orderBtn: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});
