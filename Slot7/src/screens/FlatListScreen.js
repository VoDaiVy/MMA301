import React, { useState } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';

import { STUDENT_DATA } from '../data/mockData';
import StudentItem from '../components/StudentItem';

const PAGE_SIZE = 10;

const FlatListScreen = () => {
  const [displayedStudents, setDisplayedStudents] = useState(STUDENT_DATA.slice(0, PAGE_SIZE));
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    setIsRefreshing(true); 
    
    setTimeout(() => {
      const shuffledData = [...STUDENT_DATA].sort(() => Math.random() - 0.5);
      
      setDisplayedStudents(shuffledData.slice(0, PAGE_SIZE));
      
      setIsRefreshing(false); 
    }, 1500);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || displayedStudents.length >= STUDENT_DATA.length) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const currentCount = displayedStudents.length;
      const nextBatch = STUDENT_DATA.slice(currentCount, currentCount + PAGE_SIZE);
      
      setDisplayedStudents(prev => [...prev, ...nextBatch]);
      setIsLoadingMore(false);
    }, 1000);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Danh sách lớp học</Text>
      <Text style={styles.headerCount}>
        Đang hiển thị: <Text style={styles.highlight}>{displayedStudents.length}</Text> / {STUDENT_DATA.length} sinh viên
      </Text>
      <View style={styles.progressBarBg}>
        <View style={[
          styles.progressBarFill, 
          { width: `${(displayedStudents.length / STUDENT_DATA.length) * 100}%` }
        ]} />
      </View>
    </View>
  );

  const renderFooter = () => {
    if (displayedStudents.length >= STUDENT_DATA.length) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.endText}>🎉 Đã hiển thị hết danh sách!</Text>
        </View>
      );
    }
    if (isLoadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color="#0984e3" />
          <Text style={styles.loadingText}>Đang tải thêm...</Text>
        </View>
      );
    }
    return <View style={{ height: 20 }} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedStudents}
        renderItem={({ item }) => (
          <StudentItem 
            item={item} 
            onPress={() => alert(`Chi tiết: ${item.name}`)}
          />
        )}
        keyExtractor={(item, index) => item.id + '-' + index}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}

        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}   
            onRefresh={handleRefresh}   
            colors={['#0984e3']}       
            tintColor="#0984e3"       
            title="Đang làm mới..."     
            titleColor="#0984e3"
          />
        }

        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  
  headerContainer: { marginVertical: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#2d3436' },
  headerCount: { fontSize: 14, color: '#636e72', marginTop: 4, marginBottom: 8 },
  highlight: { color: '#0984e3', fontWeight: '800', fontSize: 16 },
  
  progressBarBg: { height: 6, backgroundColor: '#dfe6e9', borderRadius: 3, width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: '#0984e3', borderRadius: 3 },

  footerContainer: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  loadingText: { marginLeft: 8, color: '#636e72' },
  endText: { color: '#b2bec3', fontWeight: '600', fontSize: 13, fontStyle: 'italic' },
});

export default FlatListScreen;