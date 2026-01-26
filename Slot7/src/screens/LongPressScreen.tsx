import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { LongPressCard } from '../components/LongPressCard';

type NotificationItem = {
  id: string;
  title: string;
  time: string;
  type: 'message' | 'alert' | 'update';
};

export const LongPressScreen = () => {
  const [data, setData] = useState<NotificationItem[]>([
    { id: '1', title: 'Tin nhắn từ Vỹ', time: '2m ago', type: 'message' },
    { id: '2', title: 'Cảnh báo bảo mật', time: '1h ago', type: 'alert' },
    { id: '3', title: 'Cập nhật hệ thống v2.0', time: '3h ago', type: 'update' },
    { id: '4', title: 'Cuộc họp nhóm React Native', time: 'Yesterday', type: 'message' },
  ]);

  const handlePress = (item: NotificationItem) => {
    Alert.alert(item.title, "Nội dung chi tiết của thông báo...");
  };

  const handleLongPress = (id: string) => {
    Alert.alert(
      "Tuỳ chọn",
      "Bạn muốn làm gì với thông báo này?",
      [
        { text: "Huỷ", style: "cancel" },
        { 
          text: "Xoá thông báo", 
          style: "destructive", 
          onPress: () => setData(prev => prev.filter(item => item.id !== id)) 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSub}>Long press to manage items</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <LongPressCard
            title={item.title}
            time={item.time}
            type={item.type}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d3436',
  },
  headerSub: {
    fontSize: 16,
    color: '#b2bec3',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});