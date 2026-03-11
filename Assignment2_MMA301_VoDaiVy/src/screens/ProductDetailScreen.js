import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import useCart      from '../hooks/useCart';
import useFavorites from '../hooks/useFavorites';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, RADIUS } from '../constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Star Rating ─────────────────────────────────────────────────────────────────
function StarRow({ rating = 0, reviewCount = 0 }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <View style={sr.row}>
      {Array(full).fill(0).map((_, i) => <Text key={`f${i}`} style={sr.filled}>★</Text>)}
      {half && <Text style={[sr.filled, { opacity: 0.55 }]}>★</Text>}
      {Array(empty).fill(0).map((_, i) => <Text key={`e${i}`} style={sr.empty}>★</Text>)}
      <Text style={sr.label}>{rating.toFixed(1)}</Text>
      {reviewCount > 0 && <Text style={sr.count}>· {reviewCount} reviews</Text>}
    </View>
  );
}
const sr = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 3 },
  filled: { fontSize: 16, color: '#F59E0B' },
  empty:  { fontSize: 16, color: '#D1D5DB' },
  label:  { fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary, marginLeft: 4 },
  count:  { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
});

// ─── Image Carousel ───────────────────────────────────────────────────────────────
function ImageCarousel({ images = [] }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return (
    <View style={ic.wrapper}>
      <FlatList
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setActive(idx);
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={ic.image} resizeMode="contain" />
        )}
      />
      {/* Dot indicators */}
      {images.length > 1 && (
        <View style={ic.dots}>
          {images.map((_, i) => (
            <View key={i} style={[ic.dot, i === active && ic.dotActive]} />
          ))}
        </View>
      )}
      {/* Image counter */}
      {images.length > 1 && (
        <View style={ic.counter}>
          <Text style={ic.counterText}>{active + 1} / {images.length}</Text>
        </View>
      )}
    </View>
  );
}
const ic = StyleSheet.create({
  wrapper: { width: SCREEN_W, height: 280, backgroundColor: '#F8F9FA' },
  image:   { width: SCREEN_W, height: 280 },
  dots:    { position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row', gap: 5 },
  dot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)' },
  dotActive: { backgroundColor: COLORS.primary, width: 20, borderRadius: 3 },
  counter: {
    position: 'absolute', top: 12, right: 14,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  counterText: { color: '#fff', fontSize: 11, fontWeight: FONT_WEIGHTS.semiBold },
});

// ─── Info Tile (brand / warranty / shipping) ──────────────────────────────────
function InfoTile({ icon, label, value }) {
  return (
    <View style={it.tile}>
      <Text style={it.icon}>{icon}</Text>
      <Text style={it.label}>{label}</Text>
      <Text style={it.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}
const it = StyleSheet.create({
  tile: {
    flex: 1, alignItems: 'center', backgroundColor: '#F8FAFF',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 6,
    borderWidth: 1, borderColor: '#E8EDFB', gap: 2,
  },
  icon:  { fontSize: 18 },
  label: { fontSize: 9, color: COLORS.textDisabled, fontWeight: FONT_WEIGHTS.semiBold, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 11, color: COLORS.textPrimary, fontWeight: FONT_WEIGHTS.bold, textAlign: 'center' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, isInCart, getItemQuantity, totalItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const inCart   = isInCart(String(product.id));
  const quantity = getItemQuantity(String(product.id));
  const loved    = isFavorite(product.id);

  const images = product.images?.length ? product.images : [product.thumbnail];
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  const handleAddToCart = () => {
    addToCart({
      id:       String(product.id),
      name:     product.title,
      price:    product.price,
      image:    product.thumbnail,
      category: product.category,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Image Carousel ── */}
        <ImageCarousel images={images} />

        {/* ── Main Content ── */}
        <View style={styles.content}>

          {/* Category pill + title */}
          <View style={styles.categoryRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            {product.brand && (
              <Text style={styles.brandText}>{product.brand}</Text>
            )}
          </View>

          <Text style={styles.title}>{product.title}</Text>

          {/* Rating row */}
          <View style={styles.ratingRow}>
            <StarRow rating={product.rating} reviewCount={product.stock} />
            {product.stock !== undefined && (
              <View style={[
                styles.stockBadge,
                { backgroundColor: product.stock > 0 ? '#D1FAE5' : '#FEE2E2' },
              ]}>
                <View style={[
                  styles.stockDot,
                  { backgroundColor: product.stock > 0 ? '#10B981' : '#EF4444' },
                ]} />
                <Text style={[
                  styles.stockText,
                  { color: product.stock > 0 ? '#065F46' : '#991B1B' },
                ]}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Text>
              </View>
            )}
          </View>

          {/* Price block */}
          <View style={styles.priceBlock}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>-{Math.round(product.discountPercentage)}% OFF</Text>
                </View>
              )}
            </View>
            {hasDiscount && (
              <Text style={styles.originalPrice}>Was ${originalPrice.toFixed(2)}</Text>
            )}
          </View>

          {/* Info tiles row */}
          <View style={styles.tilesRow}>
            <InfoTile icon="📦" label="Availability" value={product.stock > 0 ? 'In Stock' : 'Sold Out'} />
            <InfoTile icon="↩️" label="Returns" value={product.returnPolicy ?? '30-day return'} />
            <InfoTile icon="🚚" label="Shipping" value={product.shippingInformation ?? 'Fast delivery'} />
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>About this item</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Warranty */}
          {product.warrantyInformation && (
            <View style={styles.warrantyBox}>
              <Text style={styles.warrantyIcon}>🛡️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.warrantyLabel}>Warranty</Text>
                <Text style={styles.warrantyValue}>{product.warrantyInformation}</Text>
              </View>
            </View>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {product.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}># {tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* In-cart notice */}
          {inCart && (
            <View style={styles.inCartBadge}>
              <Text style={styles.inCartText}>✓  In your cart — {quantity} {quantity === 1 ? 'unit' : 'units'}</Text>
            </View>
          )}

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ── Sticky Add-to-Cart Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cartOutlineBtn}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.7}
        >
          <Text style={styles.cartOutlineIcon}>🛒</Text>
          {totalItems > 0 && (
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Heart / save button */}
        <TouchableOpacity
          style={[styles.cartOutlineBtn, loved && styles.heartBtnActive]}
          onPress={() => toggleFavorite(product)}
          activeOpacity={0.7}
        >
          <Text style={styles.cartOutlineIcon}>{loved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, inCart && styles.addBtnAlt]}
          onPress={handleAddToCart}
          activeOpacity={0.7}
        >
          <Text style={styles.addBtnText}>
            {inCart ? '+ Add Another' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.base },

  // Category + brand
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.base, marginBottom: 6 },
  categoryPill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  categoryText: { fontSize: 10, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.7 },
  brandText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.medium },

  title: {
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    lineHeight: 27,
    marginBottom: SPACING.md,
  },

  // Rating
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontSize: FONT_SIZES.xs, fontWeight: FONT_WEIGHTS.semiBold },

  // Price
  priceBlock: { marginBottom: SPACING.lg },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  price: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: -0.5,
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  discountBadgeText: { fontSize: FONT_SIZES.xs, fontWeight: FONT_WEIGHTS.bold, color: '#92400E' },
  originalPrice: { fontSize: FONT_SIZES.sm, color: COLORS.textDisabled, textDecorationLine: 'line-through', marginTop: 2 },

  // Info tiles
  tilesRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },

  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.lg },

  // Description
  sectionLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },

  // Warranty box
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  warrantyIcon: { fontSize: 18, marginTop: 1 },
  warrantyLabel: { fontSize: FONT_SIZES.xs, color: '#065F46', fontWeight: FONT_WEIGHTS.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
  warrantyValue: { fontSize: FONT_SIZES.sm, color: '#065F46', marginTop: 2 },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  tag: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.medium },

  // In-cart
  inCartBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  inCartText: { fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.semiBold, color: '#065F46' },

  // ── Sticky Footer
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  cartOutlineBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  cartOutlineIcon: { fontSize: 22 },
  heartBtnActive: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FECDD3',
  },
  footerBadge: {
    position: 'absolute', top: -6, right: -6,
    backgroundColor: COLORS.error,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.surface,
  },
  footerBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: FONT_WEIGHTS.bold },
  addBtn: {
    flex: 1, height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtnAlt: { backgroundColor: '#059669' },
  addBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.3,
  },
});

