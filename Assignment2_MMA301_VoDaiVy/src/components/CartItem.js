import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, RADIUS } from '../constants/theme';

// ─── CartItem ─────────────────────────────────────────────────────────────────
// Hiển thị một dòng sản phẩm trong giỏ hàng gồm:
//   - Ảnh thumbnail bên trái
//   - Thông tin (tên, danh mục, giá đơn, nút +/-) ở giữa
//   - Tổng tiền dòng + nút xoá bên phải
//
// Props:
//   item      – object { id, name, price, image, category, quantity }
//   onIncrease – callback khi bấm nút "+"
//   onDecrease – callback khi bấm nút "−" (quantity = 0 → tự động xoá, xử lý ở CartContext)
//   onRemove   – callback khi bấm icon thùng rác
export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <View style={styles.wrap}>
      {/* Thumbnail – hiển thị fallback emoji nếu không có ảnh */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ fontSize: 28 }}>📦</Text>
        </View>
      )}

      {/* Phần thông tin ở giữa */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        {/* Nút tăng / giảm số lượng */}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease} activeOpacity={0.7}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease} activeOpacity={0.7}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Phần bên phải: tổng tiền dòng + nút xoá */}
      <View style={styles.right}>
        <Text style={styles.lineTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={styles.removeBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: SPACING.md,
    alignItems: 'flex-start',
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
  },
  imagePlaceholder: {
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginRight: SPACING.sm },
  name: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  price: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    lineHeight: 22,
    marginTop: -1,
  },
  qtyValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  right: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 80 },
  lineTotal: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.accent,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { fontSize: 14 },
});
