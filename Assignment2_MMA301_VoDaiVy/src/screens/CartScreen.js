import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import useCart from '../hooks/useCart';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, RADIUS } from '../constants/theme';
import CartItem from '../components/CartItem';
import PriceSummary, { calcShipping } from '../components/PriceSummary';

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function CartScreen({ navigation }) {
  const {
    items,
    isEmpty,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const totalQty    = items.reduce((s, i) => s + i.quantity, 0);
  const shipping    = calcShipping(totalPrice, totalQty);
  const grandTotal  = totalPrice + shipping;
  const grandTotalF = grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  // ── Empty State ──────────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIllustration}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Looks like you haven't added anything yet. Explore our products and find
          something you'll love!
        </Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('ProductList')}
          activeOpacity={0.7}
        >
          <Text style={styles.shopBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
            onRemove={() => removeFromCart(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
            </Text>
            <TouchableOpacity onPress={clearCart} activeOpacity={0.7}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <PriceSummary
            items={items}
            totalPrice={totalPrice}
            formattedTotalPrice={formattedTotalPrice}
          />
        }
      />

      {/* ── Checkout footer ── */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total{shipping === 0 ? ' (Free ship 🎉)' : ` (Ship $${shipping.toFixed(2)})`}</Text>
          <Text style={styles.footerTotalValue}>{grandTotalF}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.7}>
          <Text style={styles.checkoutBtnText}>Checkout →</Text>
        </TouchableOpacity>
      </View>
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
  emptyIllustration: {
    fontSize: 90,
    marginBottom: SPACING.lg,
  },
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
  list: {
    padding: SPACING.base,
    paddingBottom: 100,
  },
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

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    gap: SPACING.md,
  },
  footerTotal: { gap: 2 },
  footerTotalLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  footerTotalValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extraBold,
    color: COLORS.textPrimary,
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
});
