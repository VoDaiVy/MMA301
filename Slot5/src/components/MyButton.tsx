import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

interface MyButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}

export const MyButton = ({ title, onPress, isLoading = false }: MyButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading}
      style={[
        styles.button,
        { backgroundColor: isLoading ? '#ccc' : COLORS.primary },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});