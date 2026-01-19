import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENTS } from '../../data/students'; 
import StudentCard from '../../components/StudentCard';
import SearchBar from '../../components/SearchBar'; 
import { COLORS } from '../../constants/theme';

export const StudentListScreen = () => {
  const [search, setSearch] = useState('');

  const filtered = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh sách sinh viên</Text>
          <Text style={styles.subtitle}>Danh sách lớp MMA301 - Group 3</Text>
        </View>

        <SearchBar value={search} onChange={setSearch} />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StudentCard student={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
             <Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>Không tìm thấy sinh viên nào.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F4F8' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { marginBottom: 10, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { color: '#666', fontSize: 14, marginTop: 4 },
});