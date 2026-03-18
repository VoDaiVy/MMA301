import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function ProductInput({ onAddProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddProduct = () => {
    const trimmedName = name.trim();
    const trimmedPrice = price.trim();
    const trimmedQuantity = quantity.trim();

    if (!trimmedName || !trimmedPrice || !trimmedQuantity) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    const parsedPrice = Number(trimmedPrice);
    const parsedQuantity = Number(trimmedQuantity);

    if (
      !Number.isFinite(parsedPrice) ||
      !Number.isFinite(parsedQuantity) ||
      parsedPrice <= 0 ||
      parsedQuantity <= 0
    ) {
      Alert.alert('Validation Error', 'Price and quantity must be positive numbers.');
      return;
    }

    onAddProduct({
      name: trimmedName,
      price: parsedPrice,
      quantity: parsedQuantity,
    });

    setName('');
    setPrice('');
    setQuantity('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Add Product</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
        style={styles.input}
        placeholderTextColor={COLORS.subtleText}
      />
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="decimal-pad"
        style={styles.input}
        placeholderTextColor={COLORS.subtleText}
      />
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter quantity"
        keyboardType="number-pad"
        style={styles.input}
        placeholderTextColor={COLORS.subtleText}
      />

      <Pressable style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Add Product</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
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
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#fbfdff',
  },
  addButton: {
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
