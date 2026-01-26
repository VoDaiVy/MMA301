import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppTextInput } from '../components/AppTextInput';
import { DismissKeyboardView } from '../components/DismissKeyboardView';
import { AppButton } from '../components/AppButton';

// --- ĐỊNH NGHĨA VALIDATION ---
const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Tên quá ngắn!')
    .max(50, 'Tên quá dài!')
    .required('Vui lòng nhập họ tên'),

  email: Yup.string()
    .required('Vui lòng nhập email')
    // Regex này bắt buộc email phải có dạng: text @ text . text (ít nhất 2 ký tự đuôi)
    .matches(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Email sai định dạng! (Ví dụ: name@gmail.com, sv@fpt.edu.vn)'
    ),

  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

export const RegisterFormScreen = () => {
  
  const handleRegister = (values: any) => {
    Alert.alert("Thành Công 🎉", `Chào mừng ${values.fullName} gia nhập!`);
  };

  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.headerTitle}>Tạo Tài Khoản</Text>
            <Text style={styles.subTitle}>Nhập đúng định dạng Email để tiếp tục</Text>

            <Formik
              initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={SignupSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formArea}>
                  
                  <AppTextInput
                    icon="person-outline"
                    placeholder="Họ và tên"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    error={errors.fullName}
                    touched={touched.fullName}
                  />

                  {/* Ô Email này giờ đã bắt lỗi chặt hơn */}
                  <AppTextInput
                    icon="mail-outline"
                    placeholder="Email (ví dụ: @gmail.com, @fpt.edu.vn)"
                    keyboardType="email-address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={errors.email}
                    touched={touched.email}
                    autoCapitalize="none" // Quan trọng: Email không tự viết hoa chữ đầu
                  />

                  {/* Ô Password mặc định sẽ ẩn */}
                  <AppTextInput
                    icon="lock-closed-outline"
                    placeholder="Mật khẩu"
                    isPassword={true} // Bật tính năng password
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={errors.password}
                    touched={touched.password}
                  />

                  <AppTextInput
                    icon="shield-checkmark-outline"
                    placeholder="Nhập lại mật khẩu"
                    isPassword={true}
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                  />

                  <View style={styles.buttonContainer}>
                    <AppButton 
                      title="ĐĂNG KÝ NGAY" 
                      onPress={handleSubmit as any} 
                      backgroundColor="#6c5ce7"
                    />
                  </View>

                </View>
              )}
            </Formik>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 40,
  },
  formArea: { width: '100%' },
  buttonContainer: { marginTop: 20 }
});