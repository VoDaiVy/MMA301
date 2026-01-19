import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}

export const MyButton = ({ title, onPress, isLoading }: Props) => (
  <TouchableOpacity 
    style={styles.btn} 
    onPress={onPress} 
    disabled={isLoading}
  >
    {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.text}>{title}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  text: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});