import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

export const HomeSkeletonLoader: React.FC = () => {
  const theme = useTheme();
  const opacity = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Placeholder */}
      <View style={[styles.headerBox, { backgroundColor: theme.colors.primary }]} />

      <View style={styles.content}>
        {/* Hero Card Skeleton */}
        <Animated.View
          style={[styles.heroSkeleton, { backgroundColor: theme.colors.surfaceVariant, opacity }]}
        />

        {/* Quick Actions Skeleton */}
        <View style={styles.actionsRow}>
          {[1, 2, 3, 4].map((i) => (
            <Animated.View
              key={i}
              style={[styles.actionBox, { backgroundColor: theme.colors.surfaceVariant, opacity }]}
            />
          ))}
        </View>

        {/* Active Order Card Skeleton */}
        <Animated.View
          style={[styles.cardSkeleton, { backgroundColor: theme.colors.surfaceVariant, opacity }]}
        />

        {/* Quick Order Horizontal Cards Skeleton */}
        <View style={styles.productsRow}>
          {[1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[styles.productBox, { backgroundColor: theme.colors.surfaceVariant, opacity }]}
            />
          ))}
        </View>

        {/* Offers Card Skeleton */}
        <Animated.View
          style={[styles.offerSkeleton, { backgroundColor: theme.colors.surfaceVariant, opacity }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBox: {
    height: 120,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
    marginTop: -20,
  },
  heroSkeleton: {
    height: 160,
    borderRadius: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionBox: {
    flex: 1,
    height: 70,
    borderRadius: 16,
  },
  cardSkeleton: {
    height: 140,
    borderRadius: 18,
  },
  productsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productBox: {
    width: 180,
    height: 200,
    borderRadius: 18,
  },
  offerSkeleton: {
    height: 110,
    borderRadius: 18,
  },
});
