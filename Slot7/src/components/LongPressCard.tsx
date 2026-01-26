import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LongPressCardProps {
  title: string;
  time: string;
  type: 'message' | 'alert' | 'update';
  onPress: () => void;
  onLongPress: () => void;
}

export const LongPressCard: React.FC<LongPressCardProps> = ({
  title,
  time,
  type,
  onPress,
  onLongPress,
}) => {
  
  const getIcon = () => {
    switch (type) {
      case 'message': return { name: 'chatbubble', color: '#0984e3' };
      case 'alert': return { name: 'warning', color: '#d63031' };
      case 'update': return { name: 'cloud-download', color: '#00b894' };
      default: return { name: 'notifications', color: '#636e72' };
    }
  };

  const iconInfo = getIcon();

  const handleLongPress = () => {
    Vibration.vibrate(50);
    onLongPress();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: iconInfo.color + '20' }]}>
        <Ionicons name={iconInfo.name as any} size={22} color={iconInfo.color} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.subtext} numberOfLines={2}>
          Nhấn giữ tin nhắn này để hiện menu tuỳ chọn hoặc xoá.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#b2bec3',
    fontWeight: '500',
  },
  subtext: {
    fontSize: 13,
    color: '#636e72',
    lineHeight: 18,
  },
});