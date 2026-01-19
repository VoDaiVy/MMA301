import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MyInput } from '../../components/MyInput';
import { MyButton } from '../../components/MyButton';
import { COLORS } from '../../constants/theme';
import { addUser, checkEmailExists } from '../../data/userStore';

export const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' });

  const validate = () => {
    let isValid = true;
    let errs = { email: '', password: '', confirm: '' };

    if (!form.email.includes('@')) { 
      errs.email = 'Email sai định dạng'; 
      isValid = false; 
    } 
    else if (checkEmailExists(form.email)) {
      errs.email = 'Email này đã được đăng ký!';
      isValid = false;
    }

    if (form.password.length < 6) { errs.password = 'Mật khẩu quá ngắn'; isValid = false; }
    if (form.password !== form.confirm) { errs.confirm = 'Mật khẩu không khớp'; isValid = false; }

    setErrors(errs);
    return isValid;
  };

  const handleRegister = () => {
    if (validate()) {
      addUser(form.email, form.password);
      
      Alert.alert('Thành công', 'Đăng ký thành công! Hãy đăng nhập ngay.', [
        { text: 'OK', onPress: () => navigation.goBack() } 
      ]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 30, marginTop: 20 }}>Tạo Tài Khoản</Text>
        
        <MyInput icon="mail-outline" placeholder="Email" value={form.email} onChangeText={t => setForm({...form, email: t})} error={errors.email} />
        <MyInput icon="lock-closed-outline" placeholder="Mật khẩu" isPassword value={form.password} onChangeText={t => setForm({...form, password: t})} error={errors.password} />
        <MyInput icon="shield-checkmark-outline" placeholder="Nhập lại mật khẩu" isPassword value={form.confirm} onChangeText={t => setForm({...form, confirm: t})} error={errors.confirm} />

        <MyButton title="ĐĂNG KÝ NGAY" onPress={handleRegister} />
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: COLORS.textLight }}>Đã có tài khoản? <Text style={{ color: COLORS.primary }}>Đăng nhập</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};