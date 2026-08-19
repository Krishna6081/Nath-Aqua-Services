import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, FAB, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProducts } from '../../redux/slices/productSlice';
import { GradientHeader } from '../../components/common/GradientHeader';
import { CURRENCY_SYMBOL } from '../../constants/config';
import { productApi } from '../../api/productApi';

export const AdminProductsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading } = useSelector((state: RootState) => state.products);
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await productApi.deleteProduct(id);
      dispatch(fetchProducts(undefined));
    } catch (err) {
      console.log('Delete product error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Product Management" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchProducts(undefined))}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={{ fontSize: 36, marginRight: 12 }}>
                {item.unit === 'CAN' ? '🚰' : '🚚'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={{ color: '#64748b' }}>
                  Capacity: {item.capacity} • Stock: {item.stock}
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {CURRENCY_SYMBOL}
                  {item.price.toFixed(2)} (+{CURRENCY_SYMBOL}
                  {item.deliveryCharge} delivery)
                </Text>
              </View>
              <Button compact mode="outlined" onPress={() => handleDelete(item.id)}>
                Delete
              </Button>
            </Card.Content>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        label="Add Water Product"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddEditProduct')}
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
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    borderRadius: 14,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
    borderRadius: 25,
  },
});
