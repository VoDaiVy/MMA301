import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface MyInputProps {
  icon?: keyof typeof Ionicons.glyphMap; 
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
}

export const MyInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  isPassword = false,
  error,
  keyboardType = 'default',
}: MyInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.borderColor },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={error ? COLORS.error : isFocused ? COLORS.primary : COLORS.textLight}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg || '#F5F5F5',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});