import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { GradientHeader } from '../../components/common/GradientHeader';
import { orderApi } from '../../api/orderApi';
import { Order, OrderStatus } from '../../types';

const timelineSteps: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'PENDING', label: 'Order Placed', desc: 'Order received and awaiting confirmation' },
  { status: 'CONFIRMED', label: 'Order Confirmed', desc: 'Water stock verified & order packed' },
  { status: 'PREPARING', label: 'Preparing Water Cans', desc: 'Hygienically filled and loaded' },
  { status: 'ASSIGNED', label: 'Delivery Staff Assigned', desc: 'Driver dispatched to hub' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Vehicle is on the way to your location' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Water successfully delivered & verified via OTP' },
];

export const OrderTrackingScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getOrderById(orderId);
        setOrder(res.data.order);
      } catch (err) {
        console.log('Error loading order tracking:', err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const getStepIndex = (currentStatus?: OrderStatus) => {
    switch (currentStatus) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'ASSIGNED':
        return 3;
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(order?.orderStatus);

  return (
    <View style={styles.container}>
      <GradientHeader title="Delivery Tracking" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              Order #{order?.orderNumber || '---'}
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748b', marginTop: 2 }}>
              Delivery Slot: {order?.deliveryDate} ({order?.deliveryTime})
            </Text>

            {order?.deliveryPerson && (
              <View style={styles.deliveryPersonCard}>
                <Text style={{ fontSize: 24, marginRight: 10 }}>🚚</Text>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>
                    Delivery Executive: {order.deliveryPerson.name}
                  </Text>
                  <Text variant="bodySmall" style={{ color: '#0369a1' }}>
                    📞 Call Driver: {order.deliveryPerson.phone}
                  </Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Timeline Progress View */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>
              Delivery Timeline
            </Text>

            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <View key={step.status} style={styles.timelineRow}>
                  <View style={styles.indicatorColumn}>
                    <View
                      style={[
                        styles.circle,
                        isCompleted && { backgroundColor: theme.colors.primary },
                        isCurrent && { borderWidth: 3, borderColor: '#0284c7' },
                      ]}
                    >
                      {isCompleted && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    {idx < timelineSteps.length - 1 && (
                      <View
                        style={[
                          styles.line,
                          idx < activeIndex && { backgroundColor: theme.colors.primary },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontWeight: isCompleted ? 'bold' : 'normal',
                        color: isCompleted ? '#0f172a' : '#94a3b8',
                      }}
                    >
                      {step.label}
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#64748b', marginTop: 2 }}>
                      {step.desc}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card.Content>
        </Card>
      </ScrollView>
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
    marginBottom: 14,
    borderRadius: 14,
  },
  deliveryPersonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 30,
    marginRight: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#cbd5e1',
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
  },
});
