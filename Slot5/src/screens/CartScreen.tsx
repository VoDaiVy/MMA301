import React from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { COLORS } from '../constants/theme';

export default function CartScreen({ navigation }: any) {
  const { 
    cart, totalAmount, totalQuantity, 
    increaseQuantity, decreaseQuantity, removeFromCart, clearCart 
  } = useCart();

  const handleCheckout = () => {
    Alert.alert("Đặt hàng thành công", "Cảm ơn bạn đã mua hàng tại TechZone!");
    clearCart();
    navigation.navigate('Shop');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image} 
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.category}>{item.category || 'Tech'}</Text>
        <Text 
          style={styles.price} 
          numberOfLines={1} 
          adjustsFontSizeToFit
        >
          {item.price.toLocaleString('vi-VN')} ₫
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => removeFromCart(item.id)} hitSlop={10}>
          <Ionicons name="trash-outline" size={18} color="#FF3B30" style={{ marginBottom: 10 }} />
        </TouchableOpacity>

        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQuantity(item.id)}>
            <Ionicons name="remove" size={12} color="#555" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQuantity(item.id)}>
            <Ionicons name="add" size={12} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ hàng ({totalQuantity})</Text>
        </View>
        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Xoá tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="cart-outline" size={50} color="#CCC" />
          </View>
          <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text 
              style={styles.totalAmount} 
              numberOfLines={1} 
              adjustsFontSizeToFit
            >
              {totalAmount.toLocaleString('vi-VN')} ₫
            </Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Thanh Toán Ngay</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 15, paddingVertical: 12, 
    backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EEE' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  clearText: { fontSize: 13, color: '#FF3B30', fontWeight: '500' },

  listContent: { padding: 15, paddingBottom: 100 },
  cartItem: { 
    flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, 
    padding: 10, 
    marginBottom: 10, alignItems: 'center', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 
  },
  
  imageWrapper: { 
    width: 60, height: 60, borderRadius: 10, 
    backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', 
    overflow: 'hidden' 
  },
  image: { width: '85%', height: '85%', resizeMode: 'contain' },
  
  infoContainer: { 
    flex: 1, marginLeft: 12, height: 60, justifyContent: 'space-between', paddingVertical: 2 
  },
  category: { fontSize: 10, color: '#999', textTransform: 'uppercase' },
  name: { fontSize: 14, fontWeight: '600', color: '#333' },
  price: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },

  actionsContainer: { alignItems: 'flex-end', height: 60, justifyContent: 'space-between' },
  qtyContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F5F5F5', borderRadius: 6, padding: 2 
  },
  qtyBtn: { 
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center', 
    backgroundColor: 'white', borderRadius: 5, 
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 
  },
  qtyText: { marginHorizontal: 10, fontSize: 13, fontWeight: 'bold', color: '#333' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -40 },
  emptyIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  shopNowBtn: { marginTop: 25, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 25, borderRadius: 20 },
  
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'white', padding: 15, 
    paddingBottom: Platform.OS === 'ios' ? 25 : 15, 
    borderTopLeftRadius: 20, borderTopRightRadius: 20, 
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, 
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 15 
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  totalLabel: { fontSize: 14, color: '#666' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, flex: 1, textAlign: 'right' },
  checkoutBtn: { 
    backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 10, 
    alignItems: 'center', shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 
  },
  checkoutText: { color: 'white', fontWeight: 'bold', fontSize: 15, textTransform: 'uppercase' },
});