import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Platform 
} from 'react-native';

import FlatListScreen from './src/screens/FlatListScreen';
import SectionListScreen from './src/screens/SectionListScreen';
import { STUDENT_DATA } from './src/data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('flat');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Student Manager</Text>
        <Text style={styles.headerSubtitle}>
          {activeTab === 'flat' 
            ? `Danh sách tổng: ${STUDENT_DATA.length} sinh viên`
            : 'Đang xem theo từng Chuyên ngành'}
        </Text>
      </View>

      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'flat' && styles.activeTabButton]}
            onPress={() => setActiveTab('flat')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'flat' && styles.activeTabText]}>
              All Students
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'section' && styles.activeTabButton]}
            onPress={() => setActiveTab('section')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'section' && styles.activeTabText]}>
              Grouped
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'flat' ? <FlatListScreen /> : <SectionListScreen />}
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3436',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 4,
    fontWeight: '500',
  },
  
  tabWrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f2f6', 
    borderRadius: 25,           
    padding: 4,                
    height: 50,
  },
  tabButton: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#fff', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b2bec3', 
  },
  activeTabText: {
    color: '#2d3436', 
    fontWeight: '700',
  },

  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa', 
    borderTopLeftRadius: 30,    
    borderTopRightRadius: 30,
    paddingTop: 20,
    overflow: 'hidden',        
  },
});