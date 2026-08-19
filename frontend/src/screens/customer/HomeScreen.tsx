import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, IconButton, FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchOrders } from '../../redux/slices/orderSlice';
import { ProductCard } from '../../components/customer/ProductCard';
import { addToCart } from '../../redux/slices/cartSlice';
import { StatusBadge } from '../../components/common/StatusBadge';

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.products);
  const { orders } = useSelector((state: RootState) => state.orders);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const loadData = async () => {
    dispatch(fetchProducts(undefined));
    dispatch(fetchOrders(undefined));
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const activeOrder = orders.find(
    (o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerRow}>
            <View>
              <Text variant="titleMedium" style={styles.greeting}>
                Good Morning, {user?.name || 'Customer'} 👋
              </Text>
              <Text variant="bodySmall" style={styles.location}>
                📍 Delivering to: Shivaji Nagar, Pune
              </Text>
            </View>
            <IconButton
              icon="bell-outline"
              iconColor="#ffffff"
              size={24}
              onPress={() => navigation.navigate('Notifications')}
            />
          </View>

          {/* Banner Card */}
          <Card style={styles.bannerCard}>
            <Card.Content style={styles.bannerContent}>
              <View style={styles.bannerText}>
                <Text variant="titleMedium" style={styles.bannerTitle}>
                  Need Fresh Water Fast?
                </Text>
                <Text variant="bodySmall" style={styles.bannerDesc}>
                  Order 20L Water Cans or Tankers with 30-min express delivery!
                </Text>
                <Button
                  mode="contained"
                  buttonColor="#ffffff"
                  textColor={theme.colors.primary}
                  style={styles.orderNowBtn}
                  labelStyle={{ fontWeight: 'bold' }}
                  onPress={() => navigation.navigate('WaterServices')}
                >
                  ORDER WATER NOW
                </Button>
              </View>
              <Text style={styles.waterDropLarge}>🚰</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Active Order Banner if available */}
        {activeOrder && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Current Order
            </Text>
            <Card style={styles.activeOrderCard} onPress={() => navigation.navigate('OrderDetail', { orderId: activeOrder.id })}>
              <Card.Content>
                <View style={styles.activeOrderHeader}>
                  <View>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      Order #{activeOrder.orderNumber}
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#64748b' }}>
                      Delivery: {activeOrder.deliveryDate} • {activeOrder.deliveryTime}
                    </Text>
                  </View>
                  <StatusBadge status={activeOrder.orderStatus} />
                </View>
                {activeOrder.deliveryOtp && (
                  <View style={styles.otpContainer}>
                    <Text style={styles.otpLabel}>Delivery OTP Code: </Text>
                    <Text style={styles.otpValue}>{activeOrder.deliveryOtp}</Text>
                  </View>
                )}
                <Button
                  mode="outlined"
                  compact
                  style={{ marginTop: 10 }}
                  onPress={() => navigation.navigate('OrderTracking', { orderId: activeOrder.id })}
                >
                  Track Order Timeline ➔
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Available Services / Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Available Water Services
            </Text>
            <Button compact mode="text" onPress={() => navigation.navigate('WaterServices')}>
              View All
            </Button>
          </View>

          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              onAddToCart={() => dispatch(addToCart({ product, quantity: 1 }))}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Cart Action Button */}
      {cartItems.length > 0 && (
        <FAB
          icon="cart"
          label={`${cartItems.reduce((sum, i) => sum + i.quantity, 0)} Items in Cart`}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color="#ffffff"
          onPress={() => navigation.navigate('Cart')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  location: {
    color: '#e0f2fe',
    marginTop: 2,
  },
  bannerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bannerDesc: {
    color: '#e0f2fe',
    marginVertical: 6,
  },
  orderNowBtn: {
    borderRadius: 20,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  waterDropLarge: {
    fontSize: 50,
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  activeOrderCard: {
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#0284c7',
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  otpLabel: {
    fontWeight: 'bold',
    color: '#0369a1',
  },
  otpValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0284c7',
    letterSpacing: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
    borderRadius: 25,
  },
});
