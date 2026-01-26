import React from 'react';
import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SilentTouchableProps {
  active: boolean;
  onPress: () => void;
}

export const SilentTouchable: React.FC<SilentTouchableProps> = ({ active, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Ionicons 
          name={active ? "heart" : "heart-outline"} 
          size={28} 
          color={active ? "#ff4757" : "#2f3542"} 
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});