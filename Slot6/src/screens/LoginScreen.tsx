import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler'; 
import { Ionicons } from '@expo/vector-icons'; 

import { MyInput } from '../components/MyInput';
import { MyButton } from '../components/MyButton';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    setErrors({ email: '', password: '' });
    
    let isValid = true;
    let currentErrors = { email: '', password: '' };

    if (!email.trim()) {
      currentErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!validateEmail(email)) {
      currentErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!password) {
      currentErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }

    if (!isValid) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const success = await login(email, password);
      setLoading(false);
      if (!success) {
        Alert.alert('Lỗi', 'Email hoặc mật khẩu không chính xác!');
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="hardware-chip-outline" size={50} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>VyVoTech</Text>
            <Text style={styles.subText}>Thế giới công nghệ trong tầm tay</Text>
          </View>

          <View style={styles.formContainer}>
            <MyInput 
              icon="mail-outline" 
              placeholder="Email" 
              value={email} 
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors({...errors, email: ''});
              }} 
              error={errors.email}
              keyboardType="email-address"
            />

            <MyInput 
              icon="lock-closed-outline" 
              placeholder="Mật khẩu" 
              isPassword 
              value={password} 
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors({...errors, password: ''});
              }} 
              error={errors.password} 
            />

            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.linkText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <MyButton 
              title="ĐĂNG NHẬP" 
              onPress={handleLogin} 
              isLoading={loading} 
            />
          </View>

          <View style={styles.footer}>
            <Text style={{ color: COLORS.textLight }}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.linkText, { fontWeight: 'bold' }]}>Đăng ký ngay</Text>
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
  
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center',
    marginBottom: 15
  },
  appName: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, letterSpacing: 1 },
  subText: { fontSize: 16, color: COLORS.textLight, marginTop: 5 },
  
  formContainer: { marginBottom: 20 },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -5 },
  linkText: { color: COLORS.primary, fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
});