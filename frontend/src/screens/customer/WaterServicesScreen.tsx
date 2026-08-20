import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProducts } from '../../redux/slices/productSlice';
import { GradientHeader } from '../../components/common/GradientHeader';
import { ProductCard } from '../../components/customer/ProductCard';
import { addToCart } from '../../redux/slices/cartSlice';
import { showItemAddedAlert } from '../../utils/cartAlert';

export const WaterServicesScreen = ({ navigation }: any) => {
  const [filterUnit, setFilterUnit] = useState('ALL');
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filterUnit === 'CAN') return p.unit === 'CAN';
    if (filterUnit === 'TANKER') return p.unit === 'TANKER';
    return true;
  });

  return (
    <View style={styles.container}>
      <GradientHeader title="Water Services & Products" subtitle="Select products for home & business supply" />

      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filterUnit}
          onValueChange={setFilterUnit}
          buttons={[
            { value: 'ALL', label: 'All Products' },
            { value: 'CAN', label: 'Water Cans' },
            { value: 'TANKER', label: 'Tankers' },
          ]}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchProducts(undefined))}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            onAddToCart={() => {
              dispatch(addToCart({ product: item, quantity: 1 }));
              showItemAddedAlert(item.name, navigation);
            }}
          />
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
  filterContainer: {
    padding: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
