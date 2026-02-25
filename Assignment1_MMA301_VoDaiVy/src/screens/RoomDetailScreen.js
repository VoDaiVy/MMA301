// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RoomDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Màn hình RoomDetailScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default RoomDetailScreen;