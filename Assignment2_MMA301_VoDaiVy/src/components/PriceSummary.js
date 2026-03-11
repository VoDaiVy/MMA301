import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, RADIUS } from '../constants/theme';

export function calcShipping(totalPrice, totalQty) {
  if (totalPrice >= 50 || totalQty >= 5) return 0;
  if (totalPrice >= 25) return 2.99;
  return 5.99;
}

export default function PriceSummary({ items, totalPrice, formattedTotalPrice }) {
  const totalQty    = items.reduce((s, i) => s + i.quantity, 0);
  const shipping    = calcShipping(totalPrice, totalQty);
  const grandTotal  = totalPrice + shipping;

  const priceLeft   = Math.max(0, 50 - totalPrice);
  const qtyLeft     = Math.max(0, 5 - totalQty);
  const progressPct = Math.min(1, totalPrice / 50);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Price Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal ({totalQty} {totalQty === 1 ? 'item' : 'items'})</Text>
        <Text style={styles.value}>{formattedTotalPrice}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={[styles.value, shipping === 0 && styles.free]}>
          {shipping === 0 ? 'FREE 🎉' : `$${shipping.toFixed(2)}`}
        </Text>
      </View>

      {shipping > 0 && (
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${Math.round(progressPct * 100)}%` }]} />
          </View>
          <Text style={styles.shippingNote}>
            {priceLeft <= qtyLeft * 10
              ? `Add $${priceLeft.toFixed(2)} more to get FREE shipping`
              : `Add ${qtyLeft} more item${qtyLeft !== 1 ? 's' : ''} to get FREE shipping`}
          </Text>
        </View>
      )}
      {shipping === 0 && (
        <Text style={styles.shippingNote}>You qualify for free shipping! 🚀</Text>
      )}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  value: { fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.semiBold, color: COLORS.textPrimary },
  free: { color: COLORS.success, fontWeight: FONT_WEIGHTS.bold },
  shippingNote: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 2 },
  progressWrap: { gap: 4 },
  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  totalLabel: { fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary },
  totalValue: { fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.extraBold, color: COLORS.accent },
});
