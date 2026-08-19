import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { GradientHeader } from '../../components/common/GradientHeader';

const mockNotifications = [
  { id: '1', title: 'Order Delivered! 🎉', message: 'Your water delivery #NWS847392 has been completed.', time: '10 mins ago' },
  { id: '2', title: 'Out for Delivery 🚚', message: 'Driver Ramesh is on the way to your address.', time: '1 hour ago' },
  { id: '3', title: 'Welcome to Nath Water Service! 💧', message: 'Enjoy 10% off your first water order with code WELCOME10.', time: '1 day ago' },
];

export const NotificationsScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <GradientHeader title="Notifications" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.row}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {item.title}
                </Text>
                <Text variant="bodySmall" style={{ color: '#475569', marginVertical: 2 }}>
                  {item.message}
                </Text>
                <Text variant="bodySmall" style={{ color: '#94a3b8' }}>
                  {item.time}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 10,
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
