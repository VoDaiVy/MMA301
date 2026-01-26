import React from 'react';
import { 
  TouchableNativeFeedback, 
  TouchableOpacity, 
  View, 
  Text, 
  StyleSheet, 
  Platform,
  ViewStyle 
} from 'react-native';

interface RippleButtonProps {
  title: string;
  onPress: () => void;
  color?: string;       // Màu nền nút
  rippleColor?: string; // Màu gợn sóng (chỉ Android)
  style?: ViewStyle;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  title,
  onPress,
  color = '#2196F3',      // Màu xanh Material mặc định
  rippleColor = '#ffffff', // Gợn sóng màu trắng
  style,
}) => {
  // Logic kiểm tra hệ điều hành
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.buttonContainer, style]}>
        {/* Android: Dùng TouchableNativeFeedback */}
        <TouchableNativeFeedback
          onPress={onPress}
          // Hiệu ứng gợn sóng: (Màu, có tràn viền hay không)
          background={TouchableNativeFeedback.Ripple(rippleColor, false)}
          useForeground={true} // Đảm bảo hiệu ứng đè lên trên hình nền
        >
          <View style={[styles.buttonContent, { backgroundColor: color }]}>
            <Text style={styles.text}>{title}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  // iOS: Fallback về TouchableOpacity để app không bị lỗi
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonContainer, styles.buttonContent, { backgroundColor: color }, style]}
      activeOpacity={0.6}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden', // Quan trọng: Cắt hiệu ứng gợn sóng nếu nó tràn ra ngoài
    marginVertical: 10,
    elevation: 4,       // Đổ bóng chuẩn Android
  },
  buttonContent: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});