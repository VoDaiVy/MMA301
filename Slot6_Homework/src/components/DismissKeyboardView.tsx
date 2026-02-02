import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, StyleSheet } from 'react-native';

export const DismissKeyboardView = ({ children }: { children: React.ReactNode }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>{children}</View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({ container: { flex: 1 } });