import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { SilentTouchable } from '../components/SilentTouchable';
import { Ionicons } from '@expo/vector-icons';

export const NoFeedbackScreen = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Khám phá</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#a4b0be" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Tìm bài hát, nghệ sĩ..."
              placeholderTextColor="#a4b0be"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' }} 
            style={styles.cover} 
          />
          
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.songName}>Midnight City</Text>
              <Text style={styles.artist}>M83 • Electronic</Text>
            </View>
            
            <SilentTouchable 
              active={isLiked} 
              onPress={() => setIsLiked(!isLiked)} 
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>
            Thử bấm vào thanh tìm kiếm rồi chạm ra ngoài để ẩn bàn phím.
          </Text>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#2d3436',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  cover: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  songName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#636e72',
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  hint: {
    color: '#b2bec3',
    fontSize: 13,
    textAlign: 'center',
  },
});