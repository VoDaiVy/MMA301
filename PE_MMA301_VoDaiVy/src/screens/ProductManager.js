import React, { useMemo, useReducer } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ListProduct from '../components/ListProduct';
import ProductInput from '../components/ProductInput';
import { COLORS } from '../constants/colors';
import {
  addProductAction,
  INITIAL_PRODUCTS,
  productReducer,
  removeProductAction,
} from '../context/Products';
import { formatCurrency, getProductValue } from '../utils/productHelpers';

export default function ProductManager({ navigation }) {
  const [products, dispatch] = useReducer(productReducer, INITIAL_PRODUCTS);

  const totalValue = useMemo(
    () => products.reduce((sum, item) => sum + getProductValue(item), 0),
    [products]
  );

  const handleAddProduct = (productData) => {
    dispatch(addProductAction(productData));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProductAction(productId));
  };

  const handleSelectProduct = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Simple Product Management</Text>

      <ProductInput onAddProduct={handleAddProduct} />

      <View style={styles.listContainer}>
        <ListProduct
          products={products}
          onRemoveProduct={handleRemoveProduct}
          onSelectProduct={handleSelectProduct}
        />
      </View>

      <View style={styles.totalContainer}>
        <View style={styles.totalLabelRow}>
          <MaterialCommunityIcons
            name="cash-multiple"
            size={20}
            color={COLORS.text}
            style={styles.totalIcon}
          />
          <Text style={styles.totalLabel}>Total Value:</Text>
        </View>
        <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
    marginBottom: 12,
  },
  totalContainer: {
    backgroundColor: COLORS.highlight,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalIcon: {
    marginRight: 8,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
