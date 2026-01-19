import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  image: any;
}

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <View style={styles.card}>
      <Image 
        source={typeof teacher.image === 'string' ? { uri: teacher.image } : teacher.image} 
        style={styles.avatar} 
      />

      <View style={styles.info}>
        <Text style={styles.name}>{teacher.name}</Text>

        <Text style={styles.dept}>{teacher.department}</Text>
        
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={14} color="#666" style={{ marginRight: 6 }} />
          <Text style={styles.email}>{teacher.email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: 16, 
    justifyContent: 'center',
  },
  name: {
    fontSize: 17, 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,

  },
  dept: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    fontSize: 13,
    color: '#666',
  },
});