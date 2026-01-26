import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppTextInputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean; 
  error?: string;
  touched?: boolean;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({ 
  icon, 
  isPassword = false, 
  error, 
  touched, 
  ...otherProps 
}) => {
  const [secureState, setSecureState] = useState(isPassword);

  const hasError = error && touched;

  return (
    <View style={styles.wrapper}>
      <View style={[
        styles.container, 
        { borderColor: hasError ? '#ff4757' : 'transparent' } 
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={hasError ? '#ff4757' : "#6e6e6e"} 
            style={styles.icon} 
          />
        )}

        <TextInput
          placeholderTextColor="#a0a0a0"
          style={styles.input}
          secureTextEntry={isPassword ? secureState : false}
          {...otherProps}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setSecureState(!secureState)}>
            <Ionicons 
              name={secureState ? "eye-off" : "eye"} 
              size={20} 
              color="#6e6e6e" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 15, width: '100%' },
  container: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  errorText: { color: '#ff4757', fontSize: 12, marginTop: 5, marginLeft: 5, fontWeight: '500' }
});