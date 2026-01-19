import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Xin chào Vỹ!</Text>
        <Text style={{ color: COLORS.text }}>Bạn đã đăng nhập thành công.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '90%',
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    ...SHADOWS.soft
  },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 }
});