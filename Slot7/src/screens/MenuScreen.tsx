import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MENU_ITEMS = [
  { id: 'Touch', title: 'TouchableOpacity', desc: 'Profile Card', icon: 'finger-print', color: '#6c5ce7' },
  { id: 'Ripple', title: 'Ripple Effect', desc: 'Material Buttons', icon: 'water', color: '#0984e3' },
  { id: 'LongPress', title: 'Long Press', desc: 'Notification Actions', icon: 'timer', color: '#00b894' },
  { id: 'NoFeedback', title: 'No Feedback', desc: 'Music & Like', icon: 'musical-notes', color: '#e17055' },
  { id: 'Keyboard', title: 'Keyboard Handling', desc: 'Contact Form', icon: 'keypad', color: '#fdcb6e' },
  { id: 'PanResponder', title: 'PanResponder', desc: 'Drag & Drop', icon: 'move', color: '#d63031' },
  { id: 'RegisterForm', title: 'Form Validation', desc: 'Formik & Yup', icon: 'shield-checkmark', color: '#2d3436' },
];

export const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài Tập React Native</Text>
        <Text style={styles.headerSub}>Danh sách tổng hợp các demo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.id as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#b2bec3" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3436',
  },
  headerSub: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#b2bec3',
  },
});