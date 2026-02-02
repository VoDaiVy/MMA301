import React from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppTextInput } from '../components/AppTextInput';
import { AppButton } from '../components/AppButton';
import { DismissKeyboardView } from '../components/DismissKeyboardView';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Vui lòng nhập email')
    .matches(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 
      'Email không hợp lệ (ví dụ: name@fpt.edu.vn)'
    ),
  
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(9, 'Mật khẩu phải từ 9 ký tự trở lên')
    .max(20, 'Mật khẩu không quá 20 ký tự')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,20}$/,
      'Mật khẩu sai định dạng (Cần: 1 Hoa, 1 Số, 1 Ký tự đặc biệt)'
    ),
});

export const LoginScreen = ({ navigation }: any) => {
  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
          
          {/* LOGO FPT */}
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://daihoc.fpt.edu.vn/wp-content/uploads/2017/11/logo-fpt-education.png' }} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeText}>Xin chào!</Text>
            <Text style={styles.subText}>Đăng nhập vào cổng thông tin sinh viên</Text>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema} 
              onSubmit={(values) => {
                navigation.replace('Profile', { 
                  userEmail: values.email, userName: 'Võ Đại Vỹ' 
                });
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <AppTextInput
                    icon="mail" placeholder="Email @fpt.edu.vn"
                    value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')}
                    error={errors.email} touched={touched.email}
                    autoCapitalize="none"
                  />
                  
                  <AppTextInput
                    icon="lock-closed" placeholder="Mật khẩu (Min 9, Hoa, Số, @...)" isPassword
                    value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')}
                    error={errors.password} touched={touched.password}
                  />
                  
                  <View style={{ marginTop: 10 }}>
                    <AppButton title="ĐĂNG NHẬP" onPress={handleSubmit as any} />
                  </View>
                </View>
              )}
            </Formik>

            <View style={styles.registerContainer}>
              <Text style={styles.grayText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAvoidingView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ver1.0 - VoDaiVy</Text>
        </View>
      </View>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  keyboardView: { flex: 1, justifyContent: 'center', padding: 24 },
  
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 200, height: 80 },

  card: {
    backgroundColor: 'white', padding: 30, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5
  },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#2d3436', marginBottom: 5 },
  subText: { fontSize: 14, color: '#636e72', marginBottom: 25 },
  form: { width: '100%' },

  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  grayText: { color: '#636e72' },
  linkText: { color: '#F27125', fontWeight: 'bold' },

  footer: { alignItems: 'center', paddingBottom: 20 },
  footerText: { color: '#b2bec3', fontSize: 12, fontWeight: '600' }
});