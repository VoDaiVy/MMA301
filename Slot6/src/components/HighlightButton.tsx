import React from 'react';
import { TouchableHighlight, Text, StyleSheet, TouchableHighlightProps, View } from 'react-native';

interface HighlightButtonProps extends TouchableHighlightProps {
  title: string;
  onPress: () => void;
  color?: string;         // Màu bình thường
  pressColor?: string;    // Màu khi nhấn vào (underlayColor)
}

export const HighlightButton: React.FC<HighlightButtonProps> = ({
  title,
  onPress,
  color = '#00b894',      // Mặc định màu xanh ngọc
  pressColor = '#006266', // Mặc định màu xanh đậm hơn khi nhấn
  style,
  ...props
}) => {
  return (
    <TouchableHighlight
      style={[styles.button, { backgroundColor: color }, style]}
      underlayColor={pressColor} // <--- QUAN TRỌNG: Màu nền sẽ đổi sang màu này khi nhấn
      onPress={onPress}
      activeOpacity={1} // Giữ độ đậm 100%, chỉ đổi màu nền thôi
      {...props}
    >
      <View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
    // Shadow nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});