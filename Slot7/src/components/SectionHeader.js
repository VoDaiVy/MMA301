import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SectionHeader = ({ title, count }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#dfe6e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#636e72',
  },
});

export default SectionHeader;