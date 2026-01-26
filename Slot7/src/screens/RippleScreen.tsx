import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RippleButton } from '../components/RippleButton';

export const RippleScreen = () => {
  
  const handlePress = (name: string) => {
    Alert.alert("Ripple Effect", `Bạn đã chọn: ${name}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Material Ripple</Text>
        <Text style={styles.subtitle}>Chạm vào nút để xem hiệu ứng sóng</Text>
      </View>

      <View style={styles.content}>
        <RippleButton 
          title="Xác nhận (Primary)" 
          color="#4834d4" 
          onPress={() => handlePress("Primary")}
          style={styles.buttonSpacing}
        />

        <RippleButton 
          title="Thành công (Success)" 
          color="#20bf6b" 
          onPress={() => handlePress("Success")}
          style={styles.buttonSpacing}
        />

        <RippleButton 
          title="Cảnh báo (Warning)" 
          color="#f7b731" 
          onPress={() => handlePress("Warning")}
          style={styles.buttonSpacing}
        />

        <RippleButton 
          title="Nguy hiểm (Danger)" 
          color="#eb3b5a" 
          rippleColor="rgba(255,255,255,0.4)" 
          onPress={() => handlePress("Danger")}
          style={styles.buttonSpacing}
        />

        <RippleButton 
          title="Nút Đen (Dark)" 
          color="#1e272e" 
          rippleColor="rgba(255,255,255,0.2)" 
          onPress={() => handlePress("Dark Mode")}
          style={styles.buttonSpacing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#636e72',
  },
  content: {
    width: '100%',
  },
  buttonSpacing: {
    marginBottom: 16,
    borderRadius: 12,
  }
});