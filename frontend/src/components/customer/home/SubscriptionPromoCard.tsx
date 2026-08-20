import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SubscriptionPromoCardProps {
  onCreateSubscription: () => void;
}

export const SubscriptionPromoCard: React.FC<SubscriptionPromoCardProps> = ({
  onCreateSubscription,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: '#0369a1' }]}>
        <View style={styles.leftContent}>
          <View style={styles.badge}>
            <Icon name="sync" size={12} color="#ffffff" />
            <Text style={styles.badgeText}>AUTOMATIC REFILL</Text>
          </View>

          <Text variant="titleMedium" style={styles.title}>
            Never Run Out of Water 💧
          </Text>

          <Text variant="bodySmall" style={styles.subtext}>
            Set up a regular water delivery schedule and get fresh water delivered automatically.
          </Text>

          <Button
            mode="contained"
            buttonColor="#ffffff"
            textColor="#0369a1"
            style={styles.button}
            labelStyle={{ fontWeight: '800', fontSize: 12 }}
            onPress={onCreateSubscription}
          >
            Create Subscription
          </Button>
        </View>

        <View style={styles.rightGraphic}>
          <View style={styles.circleGraphic}>
            <Text style={{ fontSize: 36 }}>📅</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#0369a1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  leftContent: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: '#ffffff',
    fontWeight: '800',
  },
  subtext: {
    color: '#e0f2fe',
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 18,
  },
  button: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rightGraphic: {
    marginLeft: 12,
  },
  circleGraphic: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
