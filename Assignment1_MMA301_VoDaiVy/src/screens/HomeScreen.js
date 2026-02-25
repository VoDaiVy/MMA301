import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
  const { theme, rooms, bookings } = useApp();
  const [greeting, setGreeting] = useState('');

  const availableRoomsCount = rooms.filter(r => r.status === 'AVAILABLE').length;
  const myActiveBookingsCount = bookings.filter(b => ['PENDING', 'APPROVED'].includes(b.status)).length;

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Chào buổi sáng');
    else if (hours < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, []);

  // Card thống kê nhỏ (Đã thu nhỏ kích thước)
  const StatsCard = ({ icon, label, value, iconColor, bgColor }) => (
    <View style={[styles.statsCard, { backgroundColor: theme.card, shadowColor: theme.subText }]}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.statsTextContainer}>
        <Text style={[styles.statsValue, { color: theme.text }]}>{value}</Text>
        <Text 
          style={[styles.statsLabel, { color: theme.subText }]} 
          numberOfLines={1} 
          adjustsFontSizeToFit // Tự co chữ lại nếu quá dài (iOS)
        >
          {label}
        </Text>
      </View>
    </View>
  );

  // Nút chức năng (Đã thu nhỏ)
  const ActionButton = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.actionBtn, { backgroundColor: theme.card, shadowColor: theme.subText }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFF" />
      </View>
      <View style={styles.actionContent}>
        <Text style={[styles.actionTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.actionSubtitle, { color: theme.subText }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.subText} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.subText }]}>{greeting},</Text>
            <Text style={[styles.username, { color: theme.text }]}>Sinh viên FPTU</Text>
          </View>
          <TouchableOpacity 
            style={[styles.settingsBtn, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tổng quan hôm nay</Text>
        <View style={styles.statsRow}>
          <StatsCard 
            icon="business" 
            label="Phòng trống" 
            value={availableRoomsCount} 
            iconColor={theme.success}
            bgColor={theme.success + '20'}
          />
          <StatsCard 
            icon="calendar" 
            label="Lịch của bạn" 
            value={myActiveBookingsCount} 
            iconColor={theme.primary} 
            bgColor={theme.primary + '20'}
          />
        </View>

        {/* Actions Menu */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Chức năng</Text>
        
        <ActionButton 
          title="Đặt phòng mới" 
          subtitle="Tìm và đặt phòng học/Lab" 
          icon="add-circle" 
          color={theme.primary} 
          onPress={() => navigation.navigate('RoomList')}
        />

        <ActionButton 
          title="Lịch sử đặt phòng" 
          subtitle="Xem trạng thái & Hủy lịch" 
          icon="time" 
          color={theme.info}
          onPress={() => navigation.navigate('MyBookings')}
        />

        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: theme.bannerBackground }]}>
          <View style={{flex: 1}}>
            <Text style={styles.bannerText}>Thông báo chung</Text>
            <Text style={styles.bannerSubText} numberOfLines={2}>
              Vui lòng tắt thiết bị điện khi rời phòng Lab.
            </Text>
          </View>
          <Ionicons name="bulb" size={32} color="rgba(255,255,255,0.8)" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 }, // Giảm padding tổng thể từ 20 -> 16
  
  // Header nhỏ gọn hơn
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Giảm từ 30 -> 20
  },
  greeting: { fontSize: 14, marginBottom: 2 }, // Font nhỏ hơn
  username: { fontSize: 20, fontWeight: 'bold' }, // Font nhỏ hơn (24 -> 20)
  settingsBtn: {
    padding: 8, // Nút nhỏ hơn
    borderRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  sectionTitle: {
    fontSize: 16, // Font nhỏ hơn (18 -> 16)
    fontWeight: '700',
    marginBottom: 12,
  },

  // Stats Card nhỏ gọn
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // Khoảng cách giữa 2 thẻ
  },
  statsCard: {
    flex: 1,
    padding: 12, // Giảm padding trong card (16 -> 12)
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: 8, // Icon nhỏ hơn
    borderRadius: 8,
  },
  statsTextContainer: {
    flex: 1, // Để text tự co giãn
  },
  statsValue: { fontSize: 18, fontWeight: 'bold' }, // (20 -> 18)
  statsLabel: { fontSize: 12 }, // (13 -> 12)

  // Action Button nhỏ gọn
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12, // Giảm padding (16 -> 12)
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 40, // (50 -> 40)
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  actionSubtitle: { fontSize: 12 },

  // Banner
  banner: {
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  bannerText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  bannerSubText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
});

export default HomeScreen;