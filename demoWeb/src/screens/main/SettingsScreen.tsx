import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { MyInput } from '../../components/MyInput';
import { MyButton } from '../../components/MyButton';
import { COLORS } from '../../constants/theme';
import { currentUser, updateProfile, logoutUser } from '../../data/userStore';

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setMajor(currentUser.major || '');
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      updateProfile({ name, phone, major });
      setLoading(false);
      Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đồng ý', 
          style: 'destructive',
          onPress: () => {
            logoutUser();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
              style={styles.avatar} 
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.emailText}>{currentUser?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          
          <MyInput 
            icon="person-outline" 
            placeholder="Họ và tên" 
            value={name} 
            onChangeText={setName} 
          />
          
          <MyInput 
            icon="call-outline" 
            placeholder="Số điện thoại" 
            value={phone} 
            onChangeText={setPhone} 
          />
          
          <MyInput 
            icon="school-outline" 
            placeholder="Chuyên ngành" 
            value={major} 
            onChangeText={setMajor} 
          />
        </View>

        <MyButton title="LƯU THAY ĐỔI" onPress={handleSave} isLoading={loading} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Phiên bản 1.0.0 - VoDaiVy</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.white },
  cameraIcon: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.primary, padding: 8, borderRadius: 20,
    borderWidth: 2, borderColor: 'white'
  },
  emailText: { marginTop: 10, fontSize: 16, color: '#666', fontWeight: '500' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 20, padding: 15,
    backgroundColor: '#FEE2E2', borderRadius: 12
  },
  logoutText: { color: COLORS.error, fontWeight: 'bold', fontSize: 16 },
  
  version: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 12 }
});