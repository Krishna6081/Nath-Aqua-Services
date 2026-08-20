import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../../../types';
import { ImageWithFallback } from '../../common/ImageWithFallback';

interface QuickOrderSectionProps {
  products: Product[];
  onViewAll: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const QuickOrderSection: React.FC<QuickOrderSectionProps> = ({
  products,
  onViewAll,
  onSelectProduct,
  onAddToCart,
}) => {
  const theme = useTheme();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Order Water Quickly
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            Express doorstep delivery
          </Text>
        </View>
        <Button compact mode="text" labelStyle={{ fontWeight: '700' }} onPress={onViewAll}>
          View All →
        </Button>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => onSelectProduct(item)}
          >
            <View style={styles.imageWrapper}>
              <ImageWithFallback
                source={item.image ? { uri: item.image } : null}
                style={styles.image}
                fallbackText={item.unit === 'TANKER' ? '🚛' : '🚰'}
              />
              <Chip style={styles.capacityChip} compact textStyle={styles.capacityText}>
                {item.capacity || 'Standard'}
              </Chip>
            </View>

            <View style={styles.cardBody}>
              <Text variant="titleSmall" style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                {item.description || 'Fresh, filtered clean drinking water.'}
              </Text>

              <View style={styles.footerRow}>
                <View>
                  <Text variant="titleSmall" style={[styles.price, { color: theme.colors.primary }]}>
                    ₹{item.price}
                  </Text>
                  {item.deliveryCharge > 0 ? (
                    <Text style={styles.deliveryFee}>+₹{item.deliveryCharge} delivery</Text>
                  ) : (
                    <Text style={styles.freeDelivery}>Free Delivery</Text>
                  )}
                </View>

                <Button
                  mode="contained"
                  compact
                  style={styles.addBtn}
                  labelStyle={{ fontSize: 11, fontWeight: '700' }}
                  onPress={() => onAddToCart(item)}
                >
                  Order
                </Button>
              </View>
            </View>
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
  headerLeft: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  card: {
    width: 200,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageWrapper: {
    height: 120,
    width: '100%',
    backgroundColor: '#f0f9ff',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  capacityChip: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#0284c7',
  },
  capacityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    padding: 12,
  },
  productName: {
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    color: '#64748b',
    marginTop: 2,
    marginBottom: 8,
    fontSize: 11,
    height: 30,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontWeight: '800',
    fontSize: 16,
  },
  deliveryFee: {
    fontSize: 9,
    color: '#94a3b8',
  },
  freeDelivery: {
    fontSize: 9,
    color: '#10b981',
    fontWeight: '700',
  },
  addBtn: {
    borderRadius: 12,
    backgroundColor: '#0284c7',
  },
});
