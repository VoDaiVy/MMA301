import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const StudentItem = ({ item, onPress }) => {
  const isActive = item.status === 'Đang học';
  const statusColor = isActive ? '#155724' : '#721c24';
  const statusBg = isActive ? '#c3e6cb' : '#f5c6cb';
  const gpaColor = item.gpa >= 3.2 ? '#F2994A' : '#2D9CDB';

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.studentId}>{item.studentId}</Text>
          <View style={styles.dotSeparator} /> 
          
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.major} numberOfLines={1}>{item.major}</Text>
      </View>

      <View style={styles.gpaContainer}>
        <Text style={styles.gpaLabel}>GPA</Text>
        <Text style={[styles.gpaScore, { color: gpaColor }]}>{item.gpa}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: { marginRight: 12 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: { 
    flex: 1, 
    justifyContent: 'center',
    paddingRight: 8 
  },
  name: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#2d3436',
    marginBottom: 4, 
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  studentId: { 
    fontSize: 13, 
    color: '#636e72',
    fontWeight: '500',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#b2bec3',
    marginHorizontal: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: { 
    fontSize: 10, 
    fontWeight: '600' 
  },
  major: { 
    fontSize: 12, 
    color: '#0984e3', 
    fontWeight: '500' 
  },
  gpaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#f1f2f6',
    minWidth: 50,
  },
  gpaLabel: { 
    fontSize: 10, 
    color: '#b2bec3', 
    marginBottom: 2,
    fontWeight: '600'
  },
  gpaScore: { 
    fontSize: 18, 
    fontWeight: '800' 
  },
});

export default StudentItem;