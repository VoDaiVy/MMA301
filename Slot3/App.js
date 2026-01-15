import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { STUDENTS } from './data/students';
import StudentCard from './components/StudentCard';
import SearchBar from './components/SearchBar';

export default function App() {
  const [search, setSearch] = useState('');

  const filtered = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Student List</Text>
        <Text style={styles.subtitle}>MMA301 · React Native (Expo)</Text>

        <SearchBar value={search} onChange={setSearch} />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StudentCard student={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }} // ⭐ FIX LỖI CARD CUỐI
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F4F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    color: '#666',
    marginBottom: 14,
  },
});
