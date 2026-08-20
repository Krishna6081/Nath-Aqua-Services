import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { Product } from '../../types';
import { CURRENCY_SYMBOL } from '../../constants/config';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onAddToCart }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.waterIcon}>{product.unit === 'CAN' ? '🚰' : '🚚'}</Text>
        </View>
        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
            {product.name}
          </Text>
          <Text variant="bodySmall" style={styles.capacity}>
            Capacity: {product.capacity} • {product.unit}
          </Text>
          <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
            {CURRENCY_SYMBOL}
            {product.price.toFixed(2)}
          </Text>
        </View>
        <Button
          mode="contained"
          buttonColor="#ef4444"
          textColor="#ffffff"
          onPress={onAddToCart}
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
          disabled={!product.isAvailable || product.stock <= 0}
        >
          Add
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    borderRadius: 16,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  waterIcon: {
    fontSize: 28,
  },
  details: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  capacity: {
    color: '#64748b',
    marginVertical: 2,
  },
  price: {
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 20,
    paddingHorizontal: 6,
  },
  addButtonLabel: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
