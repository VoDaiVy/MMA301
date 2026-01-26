import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme(); 

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn thoát?", [
      { text: "Huỷ", style: "cancel" },
      { text: "Đồng ý", onPress: logout, style: "destructive" }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Cài Đặt</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>Tài khoản</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
              <Ionicons name="person-outline" size={20} color={theme.text} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.label, { color: theme.text }]}>Người dùng</Text>
              <Text style={[styles.value, { color: theme.subText }]}>{user?.username || 'Guest'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>Hiển thị</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={theme.primary} />
              </View>
              <Text style={[styles.label, { color: theme.text, marginLeft: 10 }]}>Giao diện Tối</Text>
            </View>
            
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme} 
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={'#f4f3f4'}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 25, marginTop: 10 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, marginBottom: 10, textTransform: 'uppercase', fontWeight: '600', marginLeft: 5 },
  
  card: { borderRadius: 12, padding: 5, overflow: 'hidden' }, 
  
  row: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  info: { marginLeft: 15 },
  
  label: { fontSize: 16, fontWeight: '500' },
  value: { fontSize: 14, marginTop: 2 },
  
  logoutBtn: { 
    flexDirection: 'row', backgroundColor: '#FF3B30', padding: 15, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginTop: 10 
  },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});