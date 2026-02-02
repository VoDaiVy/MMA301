import React from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { AppTextInput } from '../components/AppTextInput';
import { AppButton } from '../components/AppButton';
import { DismissKeyboardView } from '../components/DismissKeyboardView';

const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập họ tên'),
  phone: Yup.string()
    .matches(/^0\d{9}$/, 'SĐT phải bắt đầu bằng số 0 và có 10 chữ số')
    .required('Vui lòng nhập SĐT'),
  message: Yup.string().min(10, 'Nội dung quá ngắn').required('Vui lòng nhập nội dung'),
});

export const ContactScreen = ({ navigation }: any) => {
  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#2d3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Liên Hệ Admin</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subTitle}>Gửi phản hồi hoặc yêu cầu hỗ trợ</Text>

          <Formik
            initialValues={{ name: '', phone: '', message: '' }}
            validationSchema={ContactSchema}
            onSubmit={(values, { resetForm }) => {
              Alert.alert("Đã Gửi!", `Admin sẽ liên hệ lại qua số ${values.phone}`);
              resetForm();
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <AppTextInput
                  icon="person" placeholder="Họ và tên"
                  value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')}
                  error={errors.name} touched={touched.name}
                />
                <AppTextInput
                  icon="call" placeholder="Số điện thoại (0xxxxxxxxx)" keyboardType="phone-pad"
                  value={values.phone} onChangeText={handleChange('phone')} onBlur={handleBlur('phone')}
                  error={errors.phone} touched={touched.phone}
                />
                
                <View style={[styles.textAreaBox, { borderColor: errors.message && touched.message ? '#ff4757' : '#dfe6e9' }]}>
                  <TextInput 
                    placeholder="Nội dung cần hỗ trợ..." 
                    placeholderTextColor="#b2bec3"
                    multiline numberOfLines={4} 
                    style={styles.textArea}
                    value={values.message} onChangeText={handleChange('message')} onBlur={handleBlur('message')}
                  />
                </View>
                {errors.message && touched.message && <Text style={styles.errorText}>{errors.message}</Text>}

                <View style={{ marginTop: 20 }}>
                  <AppButton title="GỬI YÊU CẦU" onPress={handleSubmit as any} />
                </View>
              </View>
            )}
          </Formik>
        </View>

        <View style={styles.spacer} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>ver1.0 - VoDaiVy</Text>
        </View>
      </View>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 24, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { padding: 10, marginRight: 10, backgroundColor: 'white', borderRadius: 10, elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2d3436' },
  card: { backgroundColor: 'white', padding: 24, borderRadius: 20, elevation: 3 },
  subTitle: { fontSize: 15, color: '#636e72', marginBottom: 20 },
  
  textAreaBox: {
    backgroundColor: '#f1f2f6', borderWidth: 1, borderRadius: 12, padding: 15, height: 120, marginBottom: 5
  },
  textArea: { fontSize: 16, color: '#2d3436', textAlignVertical: 'top', height: '100%' },
  errorText: { color: '#ff4757', fontSize: 12, marginLeft: 5 },
  
  spacer: { flex: 1 },
  footer: { alignItems: 'center', paddingBottom: 10 },
  footerText: { color: '#b2bec3', fontSize: 12, fontWeight: '600' }
});