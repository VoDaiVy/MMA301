import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DraggableBox } from '../components/DraggableBox';

export const PanResponderScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundTextContainer}>
        <Text style={styles.backgroundText}>PLAYGROUND</Text>
      </View>
      
      <View style={styles.header}>
        <Text style={styles.title}>PanResponder</Text>
        <Text style={styles.subtitle}>Giữ và kéo khối hộp đi bất cứ đâu</Text>
      </View>

      <View style={styles.content}>
        <DraggableBox />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd',
  },
  backgroundTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  backgroundText: {
    fontSize: 50,
    fontWeight: '900',
    color: '#dfe6e9',
    opacity: 0.5,
    letterSpacing: 2,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
  },
  content: {
    flex: 1,
  },
});