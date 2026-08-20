import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Order } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';

interface ActiveOrderCardProps {
  order?: Order | null;
  onTrackOrder: (orderId: string) => void;
  onOrderDetails: (orderId: string) => void;
  onNewOrder: () => void;
}

export const ActiveOrderCard: React.FC<ActiveOrderCardProps> = ({
  order,
  onTrackOrder,
  onOrderDetails,
  onNewOrder,
}) => {
  const theme = useTheme();

  if (!order) {
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Your Current Order
        </Text>
        <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.emptyContent}>
            <View style={styles.emptyIconCircle}>
              <Text style={{ fontSize: 26 }}>🚚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                No active orders
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 2 }}>
                Order your water whenever you need it.
              </Text>
            </View>
            <Button mode="contained-tonal" compact style={{ borderRadius: 12 }} onPress={onNewOrder}>
              Order Water
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  // Progress Steps calculation
  const statusSteps = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const getStepStatus = (step: string) => {
    const orderStatus = order.orderStatus;
    if (orderStatus === 'CANCELLED' || orderStatus === 'FAILED_DELIVERY') return 'inactive';

    const currentIndex = statusSteps.indexOf(orderStatus === 'ASSIGNED' ? 'PREPARING' : orderStatus);
    const stepIndex = statusSteps.indexOf(step);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'inactive';
  };

  const itemsSummary = order.items && order.items.length > 0
    ? order.items.map((i) => `${i.product?.name || 'Water Can'} × ${i.quantity}`).join(', ')
    : 'Water Order';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Your Current Order
        </Text>
        <TouchableOpacity onPress={() => onOrderDetails(order.id)}>
          <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            Details ➔
          </Text>
        </TouchableOpacity>
      </View>

      <Card style={[styles.activeCard, { backgroundColor: theme.colors.surface }]} onPress={() => onOrderDetails(order.id)}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View>
              <Text variant="titleMedium" style={styles.orderNumber}>
                Order #{order.orderNumber}
              </Text>
              <Text variant="bodySmall" style={styles.itemSummary} numberOfLines={1}>
                {itemsSummary}
              </Text>
            </View>
            <StatusBadge status={order.orderStatus} />
          </View>

          <View style={styles.deliveryTimeRow}>
            <Icon name="clock-outline" size={16} color="#0284c7" />
            <Text variant="bodySmall" style={styles.deliveryTimeText}>
              Estimated Delivery: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{order.deliveryDate} • {order.deliveryTime}</Text>
            </Text>
          </View>

          {/* Visual Progress Steps */}
          <View style={styles.progressContainer}>
            {statusSteps.map((step, idx) => {
              const status = getStepStatus(step);
              const labelMap: Record<string, string> = {
                CONFIRMED: 'Confirmed',
                PREPARING: 'Preparing',
                OUT_FOR_DELIVERY: 'Out for Delivery',
                DELIVERED: 'Delivered',
              };

              return (
                <React.Fragment key={step}>
                  <View style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepDot,
                        status === 'completed' && styles.dotCompleted,
                        status === 'active' && styles.dotActive,
                      ]}
                    >
                      {status === 'completed' ? (
                        <Icon name="check" size={10} color="#ffffff" />
                      ) : status === 'active' ? (
                        <View style={styles.innerDotActive} />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        status === 'active' && styles.labelActive,
                        status === 'completed' && styles.labelCompleted,
                      ]}
                    >
                      {labelMap[step]}
                    </Text>
                  </View>

                  {idx < statusSteps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        (status === 'completed' || status === 'active') && styles.lineCompleted,
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* Delivery OTP Badge */}
          {order.deliveryOtp && (
            <View style={styles.otpBox}>
              <View style={styles.otpLeft}>
                <Icon name="shield-key" size={18} color="#0369a1" />
                <Text style={styles.otpLabel}>Share Delivery OTP with Driver:</Text>
              </View>
              <Text style={styles.otpValue}>{order.deliveryOtp}</Text>
            </View>
          )}

          <Button
            mode="contained"
            icon="radar"
            style={styles.trackBtn}
            contentStyle={{ height: 40 }}
            labelStyle={{ fontWeight: '700' }}
            onPress={() => onTrackOrder(order.id)}
          >
            Track Order
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
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
  emptyCard: {
    borderRadius: 18,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCard: {
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#0284c7',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontWeight: '800',
    color: '#0f172a',
  },
  itemSummary: {
    color: '#64748b',
    marginTop: 2,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  deliveryTimeText: {
    color: '#0369a1',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  stepItem: {
    alignItems: 'center',
    width: 60,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: {
    backgroundColor: '#0284c7',
  },
  dotCompleted: {
    backgroundColor: '#10b981',
  },
  innerDotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  stepLabel: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  labelActive: {
    color: '#0284c7',
    fontWeight: '700',
  },
  labelCompleted: {
    color: '#10b981',
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginTop: -12,
  },
  lineCompleted: {
    backgroundColor: '#0284c7',
  },
  otpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0f2fe',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  otpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  otpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  otpValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: 2,
  },
  trackBtn: {
    borderRadius: 12,
    backgroundColor: '#0284c7',
  },
});
