import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChange }) {
  return (
    <TextInput
      style={styles.search}
      placeholder="Search student..."
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
  },
});