import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { NEWS_DATA } from '../../data/news'; 
import NewsCard from '../../components/NewsCard'; 

export const NewsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);


  const handleOpenNews = (item: any) => {
    setSelectedNews(item);
    setModalVisible(true);
  };


  const handleCloseNews = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin Tức Giáo Dục</Text>
        <Text style={styles.headerSub}>Cập nhật xu hướng công nghệ mới nhất</Text>
      </View>

      <FlatList
        data={NEWS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsCard item={item} onPress={() => handleOpenNews(item)} />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide" 
        transparent={true}   
        visible={modalVisible}
        onRequestClose={handleCloseNews} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseNews}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedNews && (
                <>
                  <Image source={{ uri: selectedNews.image }} style={styles.detailImage} />
                  
                  <View style={styles.detailBody}>
                    <Text style={styles.detailTitle}>{selectedNews.title}</Text>
                    
                    <View style={styles.detailMeta}>
                      <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.detailDate}>{selectedNews.date}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.detailContent}>{selectedNews.content}</Text>
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.bottomCloseBtn} onPress={handleCloseNews}>
              <Text style={styles.bottomCloseText}>Đóng tin tức</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  header: { padding: 20, paddingBottom: 10, backgroundColor: '#fff' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  headerSub: { fontSize: 14, color: '#666', marginTop: 4 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end', 
  },
  modalContent: {
    backgroundColor: '#fff',
    height: '90%', 
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginBottom: 10,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'contain',
    backgroundColor: '#F5F7FA'
  },
  detailBody: {
    paddingBottom: 40,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  detailDate: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 15,
  },
  detailContent: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
    textAlign: 'justify',
  },
  bottomCloseBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  bottomCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});