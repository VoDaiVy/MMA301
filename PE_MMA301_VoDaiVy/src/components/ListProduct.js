import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { formatCurrency, getProductValue } from '../utils/productHelpers';

export default function ListProduct({ products, onRemoveProduct, onSelectProduct }) {
  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const valueA = getProductValue(a);
        const valueB = getProductValue(b);
        return valueB - valueA;
      }),
    [products]
  );

  const renderItem = ({ item }) => {
    const totalValue = getProductValue(item);

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectProduct(item)}
          style={styles.productInfo}
        >
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.metaText}>Price: {formatCurrency(item.price)}</Text>
          <Text style={styles.metaText}>Qty: {item.quantity}</Text>
          <Text style={styles.totalText}>Total: {formatCurrency(totalValue)}</Text>
        </TouchableOpacity>

        <Pressable style={styles.removeButton} onPress={() => onRemoveProduct(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Product List</Text>
      <Text style={styles.subtitle}>Sorted by total value (descending)</Text>

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No products yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 10,
    color: COLORS.subtleText,
    fontSize: 13,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#fdfefe',
    padding: 10,
    gap: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  metaText: {
    color: COLORS.subtleText,
    marginBottom: 2,
    fontSize: 13,
  },
  totalText: {
    marginTop: 4,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 72,
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  emptyText: {
    color: COLORS.subtleText,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
