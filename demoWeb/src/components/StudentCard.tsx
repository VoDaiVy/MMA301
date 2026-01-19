import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Student {
  id: string;
  name: string;
  birth: string;
  major: string;
  email: string;
  grade: number;
  image: any;
}

export default function StudentCard({ student }: { student: Student }) {
  const getGradeColor = (grade: number) => {
    if (grade >= 8) return '#27ae60';
    if (grade >= 7) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.ribbonContainer}>
        <View style={[styles.ribbon, { backgroundColor: getGradeColor(student.grade) }]}>
          <Text style={styles.ribbonText}>Grade: {student.grade}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Image 
          source={typeof student.image === 'string' ? { uri: student.image } : student.image} 
          style={styles.avatar} 
        />

        <View style={styles.info}>
          <View style={styles.nameHeader}>
            <Text 
              style={styles.name} 
              numberOfLines={2} 
              ellipsizeMode="tail"
            >
              {student.name}
            </Text>
          </View>

          <Text style={styles.text}>MSSV: {student.id}</Text>
          <Text style={styles.text}>Birth: {student.birth}</Text>
          <Text style={styles.text}>{student.major}</Text>
          <Text style={styles.email}>{student.email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 18, position: 'relative' },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden', 
  },
  avatar: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: '#4F8EF7' },
  info: { marginLeft: 14, flex: 1 },

  nameHeader: {
    marginRight: 55,
    marginBottom: 4,
  },
  name: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333',
  },

  text: { color: '#555', marginTop: 3, fontSize: 13 },
  email: { color: '#777', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  
  ribbonContainer: { position: 'absolute', top: -2, right: -2, width: 120, height: 120, overflow: 'hidden', zIndex: 10 },
  ribbon: { position: 'absolute', top: 24, right: -42, width: 180, paddingVertical: 6, alignItems: 'center', transform: [{ rotate: '45deg' }] },
  ribbonText: { color: '#fff', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
});