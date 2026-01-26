import React, { useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Image, TextInput, Dimensions, StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width / 2) - 25; 

const MOCK_PRODUCTS = [
  { id: '1', name: 'iPhone 15 Pro Max', category: 'Phone', price: 34990000, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=500' },
  { id: '2', name: 'MacBook Pro M3', category: 'Laptop', price: 45990000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=500' },
  { id: '3', name: 'Sony WH-1000XM5', category: 'Audio', price: 8490000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500' },
  { id: '4', name: 'iPad Air 5', category: 'Tablet', price: 15990000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=500' },
  { id: '5', name: 'Galaxy S24 Ultra', category: 'Phone', price: 31990000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=500' },
  { id: '6', name: 'Gaming Mouse', category: 'Gear', price: 1290000, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=500' },
];

export default function ShopScreen({ navigation }: any) {
  const { addToCart, totalQuantity } = useCart(); 
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(MOCK_PRODUCTS);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const newData = MOCK_PRODUCTS.filter(item => 
        item.name.toUpperCase().includes(text.toUpperCase())
      );
      setFilteredData(newData);
    } else {
      setFilteredData(MOCK_PRODUCTS);
    }
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)} activeOpacity={0.7}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price} adjustsFontSizeToFit numberOfLines={1}>
          {item.price.toLocaleString('vi-VN')} ₫
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.contentContainer}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.username}>{user?.username || 'Tech Lover'}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')} 
            style={styles.cartIconWrapper}
          >
            <Ionicons name="cart-outline" size={28} color={COLORS.text} />
            {totalQuantity > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  contentContainer: { flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 10 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  greeting: { fontSize: 14, color: COLORS.textLight },
  username: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  cartIconWrapper: { padding: 10, backgroundColor: 'white', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'white' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 25, borderWidth: 1, borderColor: '#EFEFEF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2 },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.text },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 20 },
  card: { width: CARD_WIDTH, backgroundColor: 'white', borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3, overflow: 'hidden' },
  imageContainer: { height: 140, backgroundColor: '#fff', position: 'relative', alignItems: 'center', justifyContent: 'center' },
  productImage: { width: '100%', height: '100%' },
  addBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: COLORS.primary, width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  infoContainer: { padding: 12 },
  category: { fontSize: 12, color: COLORS.textLight, marginBottom: 2, textTransform: 'uppercase' },
  name: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 5, height: 40 },
  price: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
});