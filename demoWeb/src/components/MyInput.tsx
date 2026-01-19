import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
  error?: string;
}

export const MyInput = ({ icon, placeholder, value, onChangeText, isPassword, error }: Props) => {
  const [showPass, setShowPass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 15 }}>
      <View style={[
        styles.container,
        isFocused && { borderColor: COLORS.primary },
        error && { borderColor: COLORS.error }
      ]}>
        <Ionicons name={icon} size={20} color={error ? COLORS.error : COLORS.textLight} style={{ marginRight: 10 }} />
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPass}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? "eye" : "eye-off"} size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: { 
    flex: 1, 
    height: '100%',
    color: COLORS.text, 
    fontSize: 16 
  },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4, marginLeft: 5 }
});