import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import useFavorites from '../hooks/useFavorites';
import useCart      from '../hooks/useCart';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, RADIUS } from '../constants/theme';

// ─── FavoriteItem ─────────────────────────────────────────────────────────────
function FavoriteItem({ item, onRemove, onAddToCart, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ fontSize: 28 }}>🖼️</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
        <Text style={styles.title}  numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        {/* Add to cart */}
        <TouchableOpacity style={styles.cartBtn} onPress={onAddToCart} activeOpacity={0.7}>
          <Text style={styles.cartBtnText}>🛒</Text>
        </TouchableOpacity>
        {/* Remove from favorites */}
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={styles.removeBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function FavoritesScreen({ navigation }) {
  const { favorites, totalFavorites, removeFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleClearAll = () => {
    Alert.alert(
      'Clear Favorites',
      'Remove all saved products?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearFavorites },
      ],
    );
  };

  // ── Empty State ───────────────────────────────────────────────────────────────
  if (totalFavorites === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIllustration}>🤍</Text>
        <Text style={styles.emptyTitle}>No saved products yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the ♡ on any product to save it here for later.
        </Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('ProductList')}
          activeOpacity={0.7}
        >
          <Text style={styles.shopBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            onRemove={() => removeFavorite(item.id)}
            onAddToCart={() => {
              addToCart({
                id:       String(item.id),
                name:     item.title,
                price:    item.price,
                image:    item.thumbnail,
                category: item.category,
              });
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {totalFavorites} saved {totalFavorites === 1 ? 'product' : 'products'}
            </Text>
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Empty
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyIllustration: { fontSize: 90, marginBottom: SPACING.lg },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxl,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  shopBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.4,
  },

  // List
  list: { padding: SPACING.base, paddingBottom: 32 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  listHeaderText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  clearAll: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.error,
  },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    backgroundColor: '#F0F3FF',
  },
  imagePlaceholder: {
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 3 },
  category: {
    fontSize: 9,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textPrimary,
    lineHeight: 17,
  },
  price: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.extraBold,
    color: '#1E40AF',
  },

  // Actions
  actions: { gap: SPACING.sm, alignItems: 'center' },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtnText: { fontSize: 16 },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { fontSize: 14 },
});
