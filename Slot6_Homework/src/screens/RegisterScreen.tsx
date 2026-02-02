import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppTextInput } from '../components/AppTextInput';
import { AppButton } from '../components/AppButton';
import { DismissKeyboardView } from '../components/DismissKeyboardView';

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .required('Vui lòng nhập email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email phải đúng định dạng (vd: @gmail.com)'),
  
  password: Yup.string()
    .min(9, 'Mật khẩu tối thiểu 9 ký tự')
    .max(20, 'Mật khẩu tối đa 20 ký tự')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,20}$/,
      'Yêu cầu: 1 Hoa, 1 Số, 1 Ký tự đặc biệt'
    )
    .required('Vui lòng nhập mật khẩu'),
    
  confirmPass: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận'),
});

export const RegisterScreen = ({ navigation }: any) => {
  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://daihoc.fpt.edu.vn/wp-content/uploads/2017/11/logo-fpt-education.png' }} 
              style={styles.logo} resizeMode="contain"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.headerTitle}>Đăng Ký</Text>
            <Text style={styles.headerSub}>Tạo tài khoản sinh viên mới</Text>

            <Formik
              initialValues={{ email: '', password: '', confirmPass: '' }}
              validationSchema={RegisterSchema}
              onSubmit={(values) => {
                Alert.alert("Thành công! 🎉", `Tài khoản ${values.email} đã được tạo.`, [
                  { text: "Về trang Login", onPress: () => navigation.navigate('Login') }
                ]);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <AppTextInput
                    icon="mail" placeholder="Email"
                    value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')}
                    error={errors.email} touched={touched.email}
                    autoCapitalize="none"
                  />
                  <AppTextInput
                    icon="lock-closed" placeholder="Mật khẩu (9-20 ký tự, Hoa, Số, @...)" isPassword
                    value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')}
                    error={errors.password} touched={touched.password}
                  />
                  <AppTextInput
                    icon="shield-checkmark" placeholder="Nhập lại mật khẩu" isPassword
                    value={values.confirmPass} onChangeText={handleChange('confirmPass')} onBlur={handleBlur('confirmPass')}
                    error={errors.confirmPass} touched={touched.confirmPass}
                  />
                  
                  <View style={{ marginTop: 10 }}>
                    <AppButton title="ĐĂNG KÝ NGAY" onPress={handleSubmit as any} />
                    <AppButton title="QUAY LẠI LOGIN" onPress={() => navigation.goBack()} outline />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ver1.0 - VoDaiVy</Text>
        </View>
      </View>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 20, marginTop: 40 },
  logo: { width: 150, height: 60 },
  card: { backgroundColor: 'white', padding: 24, borderRadius: 20, elevation: 4 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2d3436' },
  headerSub: { fontSize: 14, color: '#636e72', marginBottom: 20 },
  footer: { alignItems: 'center', paddingBottom: 20 },
  footerText: { color: '#b2bec3', fontSize: 12, fontWeight: '600' }
});