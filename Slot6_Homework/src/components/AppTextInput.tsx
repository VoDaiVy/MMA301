import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  error?: string;
  touched?: boolean;
}

export const AppTextInput: React.FC<Props> = ({ icon, isPassword, error, touched, ...props }) => {
  const [secure, setSecure] = useState(isPassword);
  const hasError = error && touched;

  return (
    <View style={{ marginBottom: 15 }}>
      <View style={[styles.box, { borderColor: hasError ? '#ff4757' : '#dfe6e9' }]}>
        {icon && <Ionicons name={icon} size={18} color="#636e72" style={{ marginRight: 10 }} />}
        <TextInput 
            style={styles.input} 
            secureTextEntry={secure} 
            placeholderTextColor="#b2bec3" 
            {...props} 
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons name={secure ? "eye-off" : "eye"} size={18} color="#636e72" />
          </TouchableOpacity>
        )}
      </View>
      {hasError && <Text style={{ color: '#ff4757', fontSize: 11, marginTop: 4, marginLeft: 5 }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 50, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  input: { 
    flex: 1, 
    fontSize: 14,
    color: '#2d3436' 
  }
});