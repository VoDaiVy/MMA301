import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import SearchBar from '../../components/SearchBar';
import TeacherCard from '../../components/TeacherCard'; 
import { TEACHERS } from '../../data/teachers'; 

export const TeacherListScreen = () => {
  const [search, setSearch] = useState('');

  const filtered = TEACHERS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.title}>Giảng viên</Text>
          <Text style={styles.subtitle}>Danh bạ giảng viên FPT University</Text>
        </View>

        <SearchBar value={search} onChange={setSearch} />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TeacherCard teacher={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} 
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy giảng viên.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F4F8' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { marginTop: 10, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 16 }
});