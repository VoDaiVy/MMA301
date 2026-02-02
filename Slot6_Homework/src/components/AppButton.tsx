import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  outline?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({ title, onPress, color = '#F27125', outline = false }) => (
  <TouchableOpacity 
    style={[
      styles.button, 
      { backgroundColor: outline ? 'transparent' : color, borderColor: color, borderWidth: outline ? 1 : 0 }
    ]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.text, { color: outline ? color : 'white' }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12, 
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
    shadowColor: "#F27125",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  text: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    letterSpacing: 0.5 
  }
});