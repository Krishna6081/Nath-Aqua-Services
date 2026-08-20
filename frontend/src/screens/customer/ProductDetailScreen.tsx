import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { GradientHeader } from '../../components/common/GradientHeader';
import { addToCart } from '../../redux/slices/cartSlice';
import { CURRENCY_SYMBOL } from '../../constants/config';

import { showItemAddedAlert } from '../../utils/cartAlert';

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const product = useSelector((state: RootState) =>
    state.products.products.find((p) => p.id === productId)
  );

  if (!product) {
    return (
      <View style={styles.container}>
        <GradientHeader title="Product Details" showBack onBackPress={() => navigation.goBack()} />
        <Text style={{ padding: 24 }}>Product not found.</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    showItemAddedAlert(product.name, navigation);
  };

  return (
    <View style={styles.container}>
      <GradientHeader title={product.name} showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.icon}>{product.unit === 'CAN' ? '🚰' : '🚚'}</Text>
        </View>

        <Text variant="headlineSmall" style={styles.title}>
          {product.name}
        </Text>
        <Text variant="bodyMedium" style={styles.capacity}>
          Capacity: {product.capacity} • Category: {product.unit}
        </Text>

        <View style={styles.priceRow}>
          <Text variant="headlineMedium" style={[styles.price, { color: theme.colors.primary }]}>
            {CURRENCY_SYMBOL}
            {product.price.toFixed(2)}
          </Text>
          <Text variant="bodySmall" style={styles.deliveryFee}>
            + {CURRENCY_SYMBOL}
            {product.deliveryCharge.toFixed(2)} Delivery Fee
          </Text>
        </View>

        <Card style={styles.descCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.descTitle}>
              Description
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {product.description}
            </Text>
          </Card.Content>
        </Card>

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text variant="titleMedium" style={styles.quantityLabel}>
            Select Quantity:
          </Text>
          <View style={styles.counterRow}>
            <IconButton
              icon="minus-circle-outline"
              size={32}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            />
            <Text variant="headlineSmall" style={styles.quantityText}>
              {quantity}
            </Text>
            <IconButton
              icon="plus-circle-outline"
              size={32}
              onPress={() => setQuantity(quantity + 1)}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          buttonColor="#ef4444"
          textColor="#ffffff"
          onPress={handleAddToCart}
          style={styles.addBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          Add to Cart ({CURRENCY_SYMBOL}
          {(product.price * quantity + product.deliveryCharge).toFixed(2)})
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: '#e0f2fe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  capacity: {
    color: '#64748b',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 14,
    gap: 12,
  },
  price: {
    fontWeight: 'bold',
  },
  deliveryFee: {
    color: '#64748b',
  },
  descCard: {
    borderRadius: 16,
    marginVertical: 12,
  },
  descTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#475569',
    lineHeight: 20,
  },
  quantitySection: {
    marginTop: 20,
    alignItems: 'center',
  },
  quantityLabel: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityText: {
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  addBtn: {
    borderRadius: 25,
  },
});
