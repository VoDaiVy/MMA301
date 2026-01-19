import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MyInput } from '../../components/MyInput';
import { MyButton } from '../../components/MyButton';
import { COLORS } from '../../constants/theme';
import { loginUser } from '../../data/userStore';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setErrors({ email: '', password: '' });

    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const success = loginUser(email, password);

      if (success) {
        navigation.replace('Main'); 
      } else {
        Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không chính xác!');
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: 'center', marginVertical: 40 }}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/1200px-FPT_logo_2010.svg.png' }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>FPT University</Text>
          <Text style={styles.subtitle}>Cổng thông tin sinh viên</Text>
        </View>


        <MyInput 
            icon="mail-outline" 
            placeholder="Email nhà trường (@fpt.edu.vn)" 
            value={email} 
            onChangeText={setEmail} 
            error={errors.email} 
        />
        <MyInput 
            icon="lock-closed-outline" 
            placeholder="Mật khẩu" 
            isPassword 
            value={password} 
            onChangeText={setPassword} 
            error={errors.password} 
        />

        <MyButton title="ĐĂNG NHẬP" onPress={handleLogin} isLoading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: COLORS.textLight }}>
            Tân sinh viên? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Kích hoạt tài khoản</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  logo: {
    width: 160,   
    height: 80,    
    resizeMode: 'contain', 
    marginBottom: 10
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginTop: 5 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 5 }
});