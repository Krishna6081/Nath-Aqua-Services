import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Subscription } from '../../../types';

interface UpcomingDeliveryCardProps {
  subscription?: Subscription | null;
  onViewSubscription: () => void;
}

export const UpcomingDeliveryCard: React.FC<UpcomingDeliveryCardProps> = ({
  subscription,
  onViewSubscription,
}) => {
  const theme = useTheme();

  if (!subscription) {
    return (
      <View style={styles.container}>
        <View style={[styles.tipBanner, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.tipIconCircle}>
            <Icon name="water-check-outline" size={20} color="#0284c7" />
          </View>
          <View style={styles.tipTextContainer}>
            <Text variant="labelLarge" style={styles.tipTitle}>
              Hydration Tip 💡
            </Text>
            <Text variant="bodySmall" style={styles.tipSubtext}>
              Drinking 8 glasses of pure water daily improves energy and focus.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const productName = subscription.product?.name || '20L Water Can';
  const deliveryAddress = subscription.address
    ? `${subscription.address.houseBuilding}, ${subscription.address.area}`
    : 'Default Home Address';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Upcoming Delivery
        </Text>
        <TouchableOpacity onPress={onViewSubscription}>
          <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            Subscriptions ➔
          </Text>
        </TouchableOpacity>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={onViewSubscription}>
        <Card.Content style={styles.content}>
          <View style={styles.leftIconArea}>
            <Icon name="calendar-clock" size={28} color="#0284c7" />
          </View>

          <View style={styles.infoArea}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>
                {subscription.nextDeliveryDate || 'Tomorrow'} • {subscription.deliveryTime || '10:00 AM - 12:00 PM'}
              </Text>
            </View>

            <Text variant="titleSmall" style={styles.productText}>
              {productName} × {subscription.quantity || 1}
            </Text>

            <View style={styles.addressRow}>
              <Icon name="map-marker-outline" size={14} color="#64748b" />
              <Text variant="bodySmall" style={styles.addressText} numberOfLines={1}>
                {deliveryAddress}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  tipIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: '700',
    color: '#0f172a',
  },
  tipSubtext: {
    color: '#64748b',
    marginTop: 1,
  },
  card: {
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  leftIconArea: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoArea: {
    flex: 1,
  },
  dateBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  dateBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  productText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  addressText: {
    color: '#64748b',
    flex: 1,
  },
});
