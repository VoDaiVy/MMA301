import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, Image, StatusBar, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated'; // Thư viện Animation
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

// Badge trạng thái đẹp hơn (Nổi trên ảnh)
const StatusBadge = ({ status }) => {
  let color = '#FFF';
  let bg = 'rgba(0,0,0,0.6)'; // Mặc định đen mờ
  let label = status;
  let icon = 'ellipse';

  switch (status) {
    case 'AVAILABLE':
      bg = '#10B981'; // Xanh lá đậm
      label = 'Còn trống';
      icon = 'checkmark-circle';
      break;
    case 'BOOKED':
      bg = '#EF4444'; // Đỏ
      label = 'Đã đặt';
      icon = 'lock-closed';
      break;
    case 'MAINTENANCE':
      bg = '#6B7280'; // Xám
      label = 'Bảo trì';
      icon = 'construct';
      break;
  }

  return (
    <View style={[styles.badgeContainer, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={12} color="#FFF" style={{ marginRight: 4 }} />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
};

const RoomListScreen = ({ navigation }) => {
  const { theme, rooms } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const filters = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'LAB', label: 'Phòng Lab' },
    { id: 'CLASS', label: 'Lớp học' },
    { id: 'RESEARCH', label: 'Nghiên cứu' },
  ];

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchText = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        room.building.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === 'ALL' || room.type === selectedType;
      return matchText && matchType;
    });
  }, [rooms, searchQuery, selectedType]);

  // Component Card được bọc bởi Animated View
  const AnimatedRoomCard = ({ item, index }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 150).springify()} // Animation xuất hiện dây chuyền
      layout={Layout.springify()} // Animation khi list thay đổi vị trí
      style={[styles.cardWrapper, { shadowColor: theme.subText }]}
    >
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.card }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('RoomDetail', { roomId: item.id })}
      >
        {/* Phần Ảnh */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          {/* Badge nổi trên ảnh */}
          <View style={styles.floatingBadge}>
            <StatusBadge status={item.status} />
          </View>
          {/* Gradient mờ để text dễ đọc nếu cần (Optional) */}
        </View>
        
        {/* Phần Thông tin */}
        <View style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <Text style={[styles.roomType, { color: theme.primary }]}>{item.building}</Text>
            <View style={styles.capacityTag}>
              <Ionicons name="people" size={12} color={theme.subText} />
              <Text style={[styles.capacityText, { color: theme.subText }]}> {item.capacity}</Text>
            </View>
          </View>

          <Text style={[styles.roomName, { color: theme.text }]}>{item.name}</Text>
          
          <View style={styles.divider} />

          <View style={styles.equipmentRow}>
            <Ionicons name="wifi" size={14} color={theme.success} />
            <Text style={[styles.equipText, { color: theme.subText }]} numberOfLines={1}>
              {item.equipment}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      
      {/* Header & Search */}
      <View style={[styles.headerContainer, { backgroundColor: theme.card }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
          <Ionicons name="search" size={20} color={theme.subText} />
          <TextInput 
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Tìm phòng..."
            placeholderTextColor={theme.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Filter List Ngang */}
        <Animated.FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          style={styles.filterList}
          contentContainerStyle={{ paddingRight: 20 }}
          renderItem={({ item }) => {
            const isActive = selectedType === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { 
                    backgroundColor: isActive ? theme.primary : theme.background,
                    borderWidth: isActive ? 0 : 1,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setSelectedType(item.id)}
              >
                <Text style={[
                  styles.filterText, 
                  { color: isActive ? '#FFF' : theme.subText, fontWeight: isActive ? '700' : '500' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Main List */}
      <Animated.FlatList 
        data={filteredRooms}
        renderItem={({ item, index }) => <AnimatedRoomCard item={item} index={index} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486754.png' }} 
              style={{ width: 100, height: 100, opacity: 0.5 }} 
            />
            <Text style={[styles.emptyText, { color: theme.subText }]}>Không tìm thấy phòng nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10, // Để bóng đổ đè lên list
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  filterList: { marginTop: 12, paddingLeft: 16 },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,
    marginRight: 10,
  },
  filterText: { fontSize: 13 },

  // List & Card Styles
  listContent: { padding: 16, paddingTop: 20 },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, // Bóng đậm hơn
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160, // Ảnh cao hơn
    width: '100%',
    position: 'relative',
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backdropFilter: 'blur(10px)', // iOS only effect
  },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  cardContent: { padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roomType: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  capacityTag: { flexDirection: 'row', alignItems: 'center' },
  capacityText: { fontSize: 12, fontWeight: '600' },
  roomName: { fontSize: 18, fontWeight: '800', marginTop: 4, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
  equipmentRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  equipText: { fontSize: 13, flex: 1 },

  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16 },
});

export default RoomListScreen;