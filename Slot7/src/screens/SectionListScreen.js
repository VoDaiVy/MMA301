import React from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import { SECTION_DATA } from '../data/mockData';
import StudentItem from '../components/StudentItem';

const SectionListScreen = () => {
  
  const renderSectionHeader = ({ section: { title, data } }) => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{data.length}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={SECTION_DATA} 
        renderItem={({ item }) => (
          <StudentItem 
            item={item} 
            onPress={() => alert(`Chi tiết: ${item.name}`)}
          />
        )}
        
        renderSectionHeader={renderSectionHeader}
        
        keyExtractor={(item, index) => item.id + '-' + index}
        
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', 
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
    textTransform: 'uppercase',
  },
  badge: {
    backgroundColor: '#dfe6e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#636e72',
  },
});

export default SectionListScreen;