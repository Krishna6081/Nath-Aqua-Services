import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, useTheme, FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchOrders } from '../../redux/slices/orderSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { Product, Order, Subscription, Coupon } from '../../types';
import { addressApi } from '../../api/addressApi';
import { subscriptionApi } from '../../api/subscriptionApi';
import { couponApi } from '../../api/couponApi';
import { notificationApi } from '../../api/notificationApi';

// Home Sub-Components
import { HomeHeader } from '../../components/customer/home/HomeHeader';
import { HeroBanner } from '../../components/customer/home/HeroBanner';
import { QuickActions } from '../../components/customer/home/QuickActions';
import { QuickOrderSection } from '../../components/customer/home/QuickOrderSection';
import { ActiveOrderCard } from '../../components/customer/home/ActiveOrderCard';
import { UpcomingDeliveryCard } from '../../components/customer/home/UpcomingDeliveryCard';
import { SubscriptionPromoCard } from '../../components/customer/home/SubscriptionPromoCard';
import { SpecialOffersSection } from '../../components/customer/home/SpecialOffersSection';
import { WhyChooseUsSection } from '../../components/customer/home/WhyChooseUsSection';
import { WaterQualitySection } from '../../components/customer/home/WaterQualitySection';
import { CustomerReviewsSection } from '../../components/customer/home/CustomerReviewsSection';
import { HomeCTASection } from '../../components/customer/home/HomeCTASection';
import { HomeSkeletonLoader } from '../../components/customer/home/HomeSkeletonLoader';

import { showItemAddedAlert } from '../../utils/cartAlert';

export const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.products);
  const { orders } = useSelector((state: RootState) => state.orders);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<string>('Shivaji Nagar, Pune');
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const loadHomeData = useCallback(async () => {
    setError(null);
    try {
      // 1. Dispatch core Redux thunks
      await Promise.all([
        dispatch(fetchProducts(undefined)).unwrap().catch(() => {}),
        dispatch(fetchOrders(undefined)).unwrap().catch(() => {}),
      ]);

      // 2. Fetch default address safely
      try {
        const addrRes = await addressApi.getAddresses();
        if (addrRes.data && addrRes.data.addresses && addrRes.data.addresses.length > 0) {
          const defaultAddr = addrRes.data.addresses.find((a: any) => a.isDefault) || addrRes.data.addresses[0];
          setUserLocation(`${defaultAddr.area || defaultAddr.street || 'Pune'}, ${defaultAddr.city || 'Pune'}`);
        }
      } catch (e) {
        // preserve fallback location
      }

      // 3. Fetch active subscription safely
      try {
        const subRes = await subscriptionApi.getSubscriptions();
        const subList = Array.isArray(subRes.data)
          ? subRes.data
          : subRes.data?.subscriptions || subRes.data?.data || [];
        if (subList.length > 0) {
          const active = subList.find((s: Subscription) => s.status === 'ACTIVE') || subList[0];
          setActiveSubscription(active || null);
        } else {
          setActiveSubscription(null);
        }
      } catch (e) {
        // preserve fallback
      }

      // 4. Fetch coupons safely
      try {
        const couponRes = await couponApi.getCoupons();
        if (couponRes.data && couponRes.data.coupons) {
          setCoupons(couponRes.data.coupons);
        }
      } catch (e) {
        // preserve fallback design
      }

      // 5. Fetch unread notifications count safely
      try {
        const notifRes = await notificationApi.getNotifications();
        if (notifRes.data && notifRes.data.notifications) {
          const unread = notifRes.data.notifications.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (e) {
        // default 0
      }

    } catch (err: any) {
      setError('Unable to load your home page. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  // Find active order (not delivered, not cancelled, not failed)
  const activeOrder: Order | null = orders.find(
    (o) =>
      o.orderStatus !== 'DELIVERED' &&
      o.orderStatus !== 'CANCELLED' &&
      o.orderStatus !== 'FAILED_DELIVERY'
  ) || null;

  // Total cart quantity
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading && !refreshing) {
    return <HomeSkeletonLoader />;
  }

  if (error && (!products || products.length === 0)) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>⚠️</Text>
        <Text variant="titleMedium" style={styles.errorTitle}>
          Unable to load your home page
        </Text>
        <Text variant="bodyMedium" style={styles.errorSubtext}>
          Please check your internet connection and try again.
        </Text>
        <Button mode="contained" style={styles.retryBtn} onPress={loadHomeData}>
          Retry
        </Button>
      </View>
    );
  }

  const handleNavigateToWaterServices = () => {
    try {
      navigation.navigate('ServicesTab');
    } catch (e) {
      navigation.navigate('WaterServices');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* 1. TOP HEADER */}
        <HomeHeader
          userName={user?.name || 'Customer'}
          location={userLocation}
          unreadCount={unreadCount}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileTab')}
          onLocationPress={() => navigation.navigate('AddressList')}
        />

        {/* 2. HERO SECTION */}
        <HeroBanner onOrderPress={handleNavigateToWaterServices} />

        {/* 3. QUICK ACTIONS */}
        <QuickActions
          onOrderWater={handleNavigateToWaterServices}
          onMyOrders={() => navigation.navigate('OrdersTab')}
          onSubscriptions={() => navigation.navigate('SubscriptionsTab')}
          onAddresses={() => navigation.navigate('AddressList')}
        />

        {/* 4. ACTIVE ORDER CARD */}
        <ActiveOrderCard
          order={activeOrder}
          onTrackOrder={(orderId) => navigation.navigate('OrderTracking', { orderId })}
          onOrderDetails={(orderId) => navigation.navigate('OrderDetail', { orderId })}
          onNewOrder={handleNavigateToWaterServices}
        />

        {/* 5. QUICK ORDER SECTION (SERVICES FROM API) */}
        <QuickOrderSection
          products={products}
          onViewAll={handleNavigateToWaterServices}
          onSelectProduct={(product: Product) =>
            navigation.navigate('ProductDetail', { productId: product.id })
          }
          onAddToCart={(product: Product) => {
            dispatch(addToCart({ product, quantity: 1 }));
            showItemAddedAlert(product.name, navigation);
          }}
        />

        {/* 6. UPCOMING DELIVERY */}
        <UpcomingDeliveryCard
          subscription={activeSubscription}
          onViewSubscription={() => navigation.navigate('SubscriptionsTab')}
        />

        {/* 7. SUBSCRIPTION PROMOTION */}
        <SubscriptionPromoCard
          onCreateSubscription={() => navigation.navigate('CreateSubscription')}
        />

        {/* 8. SPECIAL OFFERS */}
        <SpecialOffersSection
          coupons={coupons}
          onOrderNow={handleNavigateToWaterServices}
        />

        {/* 9. WHY CHOOSE NATH WATER SERVICE */}
        <WhyChooseUsSection />

        {/* 10. WATER QUALITY SECTION */}
        <WaterQualitySection />

        {/* 11. CUSTOMER REVIEWS */}
        <CustomerReviewsSection />

        {/* 12. CALL TO ACTION */}
        <HomeCTASection onOrderNow={handleNavigateToWaterServices} />
      </ScrollView>

      {/* 13. FLOATING QUICK ORDER / CART BUTTON */}
      {totalCartCount > 0 ? (
        <FAB
          icon="cart"
          label={`${totalCartCount} ${totalCartCount === 1 ? 'Item' : 'Items'} in Cart`}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color="#ffffff"
          onPress={() => navigation.navigate('Cart')}
        />
      ) : (
        <FAB
          icon="water-plus"
          label="Order Water"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color="#ffffff"
          onPress={handleNavigateToWaterServices}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  errorSubtext: {
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    borderRadius: 14,
    backgroundColor: '#0284c7',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 12,
    borderRadius: 28,
    elevation: 5,
  },
});
