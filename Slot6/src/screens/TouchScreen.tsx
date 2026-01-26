import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const TouchScreen = () => {
  const handlePress = (action: string) => {
    Alert.alert("Thông báo", `Bạn đã chọn: ${action}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://img.freepik.com/vector-cao-cap/mot-buc-ve-hoat-hinh-ve-mot-cau-be-deo-kinh_481747-103128.jpg' }} 
            style={styles.avatar} 
          />
          <View style={styles.info}>
            <Text style={styles.name}>Võ Đại Vỹ</Text>
            <Text style={styles.role}>Software Engineer</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4.5k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={[styles.button, styles.primaryBtn]}
            onPress={() => handlePress('Follow')}
          >
            <Text style={styles.primaryBtnText}>Follow</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={[styles.button, styles.secondaryBtn]}
            onPress={() => handlePress('Message')}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2d3436" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  role: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  statLabel: {
    fontSize: 14,
    color: '#b2bec3',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    marginRight: 15,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    width: 60,
    backgroundColor: '#dfe6e9',
  },
});