import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../components/AppButton';

export const ProfileScreen = ({ route, navigation }: any) => {
  const { userEmail, userName } = route.params || { userEmail: 'test@email.com', userName: 'Sinh Viên' };
  
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      { text: "Đồng ý", onPress: () => navigation.replace('Login') }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        
        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.headerTitle, { transform: [{ scale: scaleValue }] }]}>
            PROFILE
          </Animated.Text>
        </View>

        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80' }} 
            style={styles.avatar} 
          />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.role}>Sinh Viên FPT</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Ionicons name="mail" size={20} color="#6c5ce7" />
            <Text style={styles.infoText}>{userEmail}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Ionicons name="school" size={20} color="#6c5ce7" />
            <Text style={styles.infoText}>Khoá K18 - Ngành SE</Text>
          </View>
        </View>

        <View style={styles.actions}>
            <Text style={styles.sectionTitle}>Tuỳ chọn</Text>
            
            <AppButton 
                title="LIÊN HỆ GIẢNG VIÊN" 
                onPress={() => navigation.navigate('Contact')} 
                color="#0984e3"
            />

            <AppButton 
                title="ĐĂNG XUẤT" 
                onPress={handleLogout} 
                color="#d63031"
                outline
            />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ver1.0 - VoDaiVy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  
  headerBackground: { 
    height: 240, 
    backgroundColor: '#6c5ce7', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingBottom: 20, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    shadowColor: "#6c5ce7", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20
  },
  
  titleContainer: { 
    alignItems: 'center', 
    marginTop: 20 
  },
  headerTitle: {
    fontSize: 40, 
    fontWeight: '900',
    color: 'rgba(255,255,255,0.95)', 
    letterSpacing: 6, 
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  avatarContainer: { 
    width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: 'white', 
    position: 'absolute', bottom: -55, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10
  },
  avatar: { width: '100%', height: '100%', borderRadius: 55 },
  
  body: { flex: 1, marginTop: 65, paddingHorizontal: 24, alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#2d3436' },
  role: { fontSize: 16, color: '#636e72', marginBottom: 20 },
  
  infoCard: { 
    width: '100%', backgroundColor: 'white', borderRadius: 16, padding: 20, 
    shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, 
    marginBottom: 20 
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  infoText: { marginLeft: 15, fontSize: 15, color: '#2d3436' },
  divider: { height: 1, backgroundColor: '#f1f2f6', width: '100%' },
  
  actions: { width: '100%' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3436', marginBottom: 5 },
  
  footer: { alignItems: 'center', paddingBottom: 20, marginTop: 'auto' },
  footerText: { color: '#b2bec3', fontSize: 12, fontWeight: '600' }
});