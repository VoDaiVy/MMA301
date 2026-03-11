import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, RADIUS } from '../constants/theme';

function StarRating({ rating = 0 }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <View style={sr.row}>
      {Array(full).fill(0).map((_, i) => <Text key={`f${i}`} style={sr.star}>★</Text>)}
      {half && <Text style={[sr.star, sr.half]}>★</Text>}
      {Array(empty).fill(0).map((_, i) => <Text key={`e${i}`} style={sr.empty}>★</Text>)}
      <Text style={sr.label}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const sr = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star:  { fontSize: 12, color: '#F59E0B' },
  half:  { opacity: 0.5 },
  empty: { fontSize: 12, color: '#D1D5DB' },
  label: { fontSize: 10, color: COLORS.textSecondary, marginLeft: 4, fontWeight: FONT_WEIGHTS.semiBold },
});

function ProductCard({ product, onPress, onAddToCart, isFavorite, onToggleFavorite }) {
  const { title, price, thumbnail, rating, category, discountPercentage } = product;
  const hasDiscount = discountPercentage && discountPercentage > 0;
  const originalPrice = hasDiscount
    ? (price / (1 - discountPercentage / 100))
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />
        {hasDiscount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{Math.round(discountPercentage)}%</Text>
          </View>
        )}
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={onToggleFavorite}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            activeOpacity={0.7}
          >
            <Text style={styles.heartIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <Text style={styles.category} numberOfLines={1}>{category}</Text>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <StarRating rating={rating} />
        </View>

        <View style={styles.footer}>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
            <View style={styles.originalPriceSlot}>
              {hasDiscount && (
                <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={onAddToCart}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECEEFF',
    shadowColor: '#4F63D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 4,
  },

  imageWrap: {
    width: '100%',
    height: 160,
    backgroundColor: '#F0F3FF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: '#EF4444',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.3,
  },

  heartBtn: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: { fontSize: 14 },

  // Body
  body: {
    padding: SPACING.md,
    paddingTop: 10,
    flexDirection: 'column',
  },
  bodyTop: {
    gap: 4,
    marginBottom: 10,
  },
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
    minHeight: 34,   
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',   
  },
  priceBlock: {
    gap: 1,
  },
  price: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.extraBold,
    color: '#1E40AF',
    letterSpacing: -0.3,
  },
  originalPriceSlot: {
    height: 14,
    justifyContent: 'center',
  },
  originalPrice: {
    fontSize: 10,
    color: COLORS.textDisabled,
    textDecorationLine: 'line-through',
  },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
