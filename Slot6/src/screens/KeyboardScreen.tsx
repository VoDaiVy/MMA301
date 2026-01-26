import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, 
  KeyboardAvoidingView, Platform, TouchableOpacity, Alert 
} from 'react-native';
import { DismissKeyboardView } from '../components/DismissKeyboardView';
import { Ionicons } from '@expo/vector-icons';

export const KeyboardScreen = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    Alert.alert("Đã gửi", "Cảm ơn phản hồi của bạn!");
    setSubject('');
    setMessage('');
  };

  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Liên hệ hỗ trợ</Text>
          <Text style={styles.subtitle}>Chúng tôi luôn sẵn sàng lắng nghe bạn</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.formContainer}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu đề</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color="#636e72" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Vấn đề bạn đang gặp phải..."
                placeholderTextColor="#b2bec3"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nội dung chi tiết</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mô tả chi tiết vấn đề..."
                placeholderTextColor="#b2bec3"
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Gửi phản hồi</Text>
            <Ionicons name="paper-plane-outline" size={20} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </View>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f5f6fa',
  },
  textAreaWrapper: {
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2d3436',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top', 
  },
  button: {
    backgroundColor: '#6c5ce7',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});