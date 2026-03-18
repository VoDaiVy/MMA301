import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { formatCurrency, getProductValue } from '../utils/productHelpers';

function DetailRow({ label, value, iconName, iconColor = COLORS.subtleText, valueStyle }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.labelGroup}>
        <MaterialCommunityIcons
          name={iconName}
          size={18}
          color={iconColor}
          style={styles.rowIcon}
        />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
    </View>
  );
}

export default function ProductDetail({ route, navigation }) {
  const product = route.params?.product;

  if (!product) {
    return (
      <LinearGradient colors={['#f8fffd', '#ecf4ff']} style={styles.gradientContainer}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={24}
              color="#b08968"
              style={styles.titleIcon}
            />
            <Text style={styles.title}>Product Details</Text>
          </View>

          <Text style={styles.missingText}>Product data is not available.</Text>
          <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  const totalValue = getProductValue(product);

  return (
    <LinearGradient colors={['#f8fffd', '#ecf4ff']} style={styles.gradientContainer}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={24}
            color="#b08968"
            style={styles.titleIcon}
          />
          <Text style={styles.title}>Product Details</Text>
        </View>

        <DetailRow label="Name:" iconName="pin-outline" value={product.name} />
        <DetailRow
          label="Price:"
          iconName="cash"
          iconColor="#d97706"
          value={formatCurrency(product.price)}
          valueStyle={styles.priceValue}
        />
        <DetailRow label="Quantity:" iconName="package-variant-closed" value={`${product.quantity}`} />

        <View style={styles.totalRow}>
          <View style={styles.totalLabelGroup}>
            <MaterialCommunityIcons
              name="cash-multiple"
              size={18}
              color={COLORS.text}
              style={styles.totalIcon}
            />
            <Text style={styles.totalLabel}>Total</Text>
          </View>
          <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
        </View>

        <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titleIcon: {
    marginRight: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLabel: {
    fontSize: 16,
    color: COLORS.subtleText,
    fontWeight: '600',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 6,
  },
  rowValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
  },
  priceValue: {
    color: '#b45309',
  },
  totalRow: {
    marginTop: 6,
    backgroundColor: COLORS.highlight,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalIcon: {
    marginRight: 6,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  closeButton: {
    marginTop: 18,
    alignSelf: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeText: {
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  missingText: {
    color: COLORS.subtleText,
    textAlign: 'center',
    fontSize: 15,
  },
});
