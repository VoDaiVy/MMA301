import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import useCart from '../hooks/useCart';
import { extractPriceHint } from '../hooks/useGeminiAI';
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
    removeByPrice,
  } = useCart();

  // ── Remove-by-price modal state ───────────────────────────────────
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [priceInput,        setPriceInput       ] = useState('');

  /** Parse giá từ cỗi nhập và trả về { condition, label } hoặc null */
  const parsePriceInput = (raw) => {
    const str = raw.trim();
    if (!str) return null;

    // Range: "$50-$200", "50 to 200", "$50–$300"
    const rangeMatch = str.match(/\$?\s*([\d,.]+)\s*(?:[-–]|\bto\b)\s*\$?\s*([\d,.]+)/i);
    if (rangeMatch) {
      const lo = parseFloat(rangeMatch[1].replace(/,/g, ''));
      const hi = parseFloat(rangeMatch[2].replace(/,/g, ''));
      if (!isNaN(lo) && !isNaN(hi)) {
        const minP = Math.min(lo, hi);
        const maxP = Math.max(lo, hi);
        return { condition: { mode: 'range', lo: minP, hi: maxP }, label: `$${minP} – $${maxP}` };
      }
    }

    // under / over / around — via extractPriceHint
    const hint = extractPriceHint(str);
    if (hint) {
      const label =
        hint.mode === 'under'  ? `under $${hint.value}` :
        hint.mode === 'over'   ? `over $${hint.value}`  :
                                  `around $${hint.value} (±20%)`;
      return { condition: hint, label };
    }
    return null;
  };

  const handleConfirmRemoveByPrice = () => {
    const parsed = parsePriceInput(priceInput);
    if (!parsed) {
      Alert.alert('Invalid input', 'Please enter a valid price condition, e.g.:\n• under $50\n• over $100\n• $50-$200\n• around $75');
      return;
    }
    // Count affected items before removing
    const TOLERANCE = 0.20;
    const { condition } = parsed;
    const affected = items.filter((item) => {
      if (condition.mode === 'range') return item.price >= condition.lo && item.price <= condition.hi;
      if (condition.mode === 'under') return item.price <= condition.value;
      if (condition.mode === 'over')  return item.price >= condition.value;
      return (
        item.price >= condition.value * (1 - TOLERANCE) &&
        item.price <= condition.value * (1 + TOLERANCE)
      );
    });
    if (affected.length === 0) {
      Alert.alert('No match', `No items in your cart match: ${parsed.label}`);
      return;
    }
    Alert.alert(
      'Remove items',
      `Remove ${affected.length} item${affected.length !== 1 ? 's' : ''} priced ${parsed.label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeByPrice(condition);
            setPriceModalVisible(false);
            setPriceInput('');
          },
        },
      ]
    );
  };

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
            <View style={styles.listHeaderActions}>
              <TouchableOpacity
                onPress={() => { setPriceInput(''); setPriceModalVisible(true); }}
                activeOpacity={0.7}
                style={styles.removePriceBtn}
              >
                <Text style={styles.removePriceBtnText}>By price 💸</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearCart} activeOpacity={0.7}>
                <Text style={styles.clearAll}>Clear All</Text>
              </TouchableOpacity>
            </View>
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

      {/* ── Remove by price modal ── */}
      <Modal
        visible={priceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPriceModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPriceModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Remove items by price 💸</Text>
              <Text style={styles.modalHint}>
                {'Enter a price condition:\n'}
                <Text style={styles.modalHintExample}>"under $50" • "over $100" • "$50-$200" • "$75"</Text>
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. under $50"
                placeholderTextColor={COLORS.textSecondary}
                value={priceInput}
                onChangeText={setPriceInput}
                returnKeyType="done"
                onSubmitEditing={handleConfirmRemoveByPrice}
                autoFocus
              />
              {/* Preview */}
              {!!parsePriceInput(priceInput) && (
                <Text style={styles.modalPreview}>
                  ✔ Will remove items priced{' '}
                  <Text style={{ fontWeight: FONT_WEIGHTS.bold }}>{parsePriceInput(priceInput)?.label}</Text>
                </Text>
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => setPriceModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalBtnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnConfirm]}
                  onPress={handleConfirmRemoveByPrice}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalBtnConfirmText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

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
  listHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  removePriceBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  removePriceBtnText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: '#92400E',
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

  // ── Remove-by-price modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xxl,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  modalHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  modalHintExample: {
    fontStyle: 'italic',
    color: COLORS.primary,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  modalPreview: {
    fontSize: FONT_SIZES.sm,
    color: '#16A34A',
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalBtnCancelText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textSecondary,
  },
  modalBtnConfirm: {
    backgroundColor: COLORS.error,
  },
  modalBtnConfirmText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
});
