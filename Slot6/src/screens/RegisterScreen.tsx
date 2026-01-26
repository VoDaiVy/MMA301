import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import { MyInput } from '../components/MyInput';
import { MyButton } from '../components/MyButton';
import { COLORS } from '../constants/theme';
import { validateEmail } from '../utils/validation';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleRegister = () => {
    let isValid = true;
    let currentErrors = { email: '', password: '', confirm: '' };

    if (!form.email.trim()) {
      currentErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!validateEmail(form.email)) {
      currentErrors.email = 'Email sai định dạng';
      isValid = false;
    }

    if (!form.password || form.password.length < 6) {
      currentErrors.password = 'Mật khẩu phải từ 6 ký tự trở lên';
      isValid = false;
    }

    if (form.confirm !== form.password) {
      currentErrors.confirm = 'Mật khẩu không khớp';
      isValid = false;
    }

    if (!isValid) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Thành công', 
        'Chào mừng bạn đến với TechZone! Vui lòng đăng nhập.',
        [{ text: 'Đăng nhập', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Đăng Ký Thành Viên</Text>
            <Text style={styles.subtitle}>Nhận ưu đãi và mua sắm tiện lợi hơn</Text>
          </View>

          <View style={styles.formContainer}>
            <MyInput 
              icon="mail-outline" 
              placeholder="Email của bạn" 
              value={form.email} 
              onChangeText={(t) => handleChange('email', t)} 
              error={errors.email}
              keyboardType="email-address"
            />
            
            <MyInput 
              icon="lock-closed-outline" 
              placeholder="Mật khẩu" 
              isPassword 
              value={form.password} 
              onChangeText={(t) => handleChange('password', t)} 
              error={errors.password} 
            />
            
            <MyInput 
              icon="shield-checkmark-outline" 
              placeholder="Nhập lại mật khẩu" 
              isPassword 
              value={form.confirm} 
              onChangeText={(t) => handleChange('confirm', t)} 
              error={errors.confirm} 
            />

            <View style={{ marginTop: 20 }}>
              <MyButton 
                title="TẠO TÀI KHOẢN" 
                onPress={handleRegister} 
                isLoading={loading}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: COLORS.textLight }}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center' },
  
  formContainer: { marginBottom: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
});