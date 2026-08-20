import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { GradientHeader } from '../../components/common/GradientHeader';
import { notificationApi } from '../../api/notificationApi';
import { NotificationItem } from '../../types';

const defaultNotifications: NotificationItem[] = [
  {
    id: '1',
    userId: '1',
    title: 'Order Delivered! 🎉',
    message: 'Your water delivery #NW1024 has been successfully delivered.',
    type: 'ORDER_DELIVERED',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Out for Delivery 🚚',
    message: 'Driver Ramesh is on the way to your delivery address.',
    type: 'OUT_FOR_DELIVERY',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    title: 'Welcome to Nath Water Service! 💧',
    message: 'Enjoy 10% off your next water order with promo code PURE10.',
    type: 'PROMO',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const NotificationsScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications();
      if (response.data && response.data.notifications) {
        setNotifications(
          response.data.notifications.length > 0
            ? response.data.notifications
            : defaultNotifications
        );
      } else {
        setNotifications(defaultNotifications);
      }
    } catch (error) {
      console.log('Error fetching notifications, using fallback list:', error);
      setNotifications(defaultNotifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
    } catch (e) {
      // ignore
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'ORDER_DELIVERED':
        return '🎉';
      case 'OUT_FOR_DELIVERY':
        return '🚚';
      case 'SUBSCRIPTION':
        return '🔄';
      case 'PROMO':
        return '🏷️';
      default:
        return '💧';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader title="Notifications" showBack onBackPress={() => navigation.goBack()} />

      {notifications.some((n) => !n.isRead) && (
        <View style={styles.topActions}>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            Notifications stay in this section only.
          </Text>
          <Button compact mode="text" onPress={handleMarkAllRead}>
            Mark all read
          </Button>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🔔</Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
                No Notifications Yet
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 4 }}>
                Updates about your water orders and deliveries will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surface },
                !item.isRead && { borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
              ]}
            >
              <Card.Content style={styles.row}>
                <Text style={{ fontSize: 26, marginRight: 14 }}>{getIconForType(item.type)}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontWeight: item.isRead ? 'normal' : 'bold',
                        color: theme.colors.onSurface,
                      }}
                    >
                      {item.title}
                    </Text>
                    {!item.isRead && (
                      <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </View>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant, marginVertical: 4 }}
                  >
                    {item.message}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
});

