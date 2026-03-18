import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelectedCar } from '../context/SelectedCarContext';

const statusColors = {
  AVAILABLE: '#1b8f3b',
  RENTED: '#d97706',
  MAINTENANCE: '#b91c1c'
};

function CarDetailScreen({ route, navigation }) {
  const { selectedCar, setSelectedCar } = useSelectedCar();
  const car = route?.params?.car || selectedCar;

  useEffect(() => {
    if (route?.params?.car && route.params.car?._id !== selectedCar?._id) {
      setSelectedCar(route.params.car);
    }
  }, [route?.params?.car, selectedCar?._id, setSelectedCar]);

  if (!car) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.centeredContainer}>
          <Text style={styles.errorTitle}>Car data not found</Text>
          <Text style={styles.errorText}>Please return to Search Cars and select a car again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasImage = typeof car.image === 'string' && car.image.length > 0;
  const statusColor = statusColors[car.status] || '#334155';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Car Details</Text>

        <View style={styles.heroCard}>
          {hasImage ? (
            <Image source={{ uri: car.image }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroImagePlaceholder}>
              <Text style={styles.heroImageText}>{car.brand?.[0] || 'C'}{car.model?.[0] || 'R'}</Text>
            </View>
          )}

          <View style={styles.heroTextWrap}>
            <Text style={styles.carName}>{car.brand} {car.model}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusBadgeText}>{car.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>License Plate</Text>
            <Text style={styles.value}>{car.licensePlate || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price / Day</Text>
            <Text style={styles.priceValue}>{Number(car.pricePerDay || 0).toLocaleString('vi-VN')} VND</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Seats</Text>
            <Text style={styles.value}>{car.seats || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Transmission</Text>
            <Text style={styles.value}>{car.transmission || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fuel</Text>
            <Text style={styles.value}>{car.fuelType || 'N/A'}</Text>
          </View>
        </View>

        {car.description ? (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{car.description}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'QuickBooking',
              params: { selectedCar: car }
            })
          }
        >
          <Text style={styles.primaryButtonText}>Quick Book This Car</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 28
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc'
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  heroImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#e2e8f0'
  },
  heroImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroImageText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e3a8a'
  },
  heroTextWrap: {
    flex: 1
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 12
  },
  carName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  statusBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12
  },
  label: {
    color: '#64748b',
    fontWeight: '600',
    flexShrink: 0
  },
  value: {
    color: '#0f172a',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right'
  },
  priceValue: {
    color: '#0f172a',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right'
  },
  descriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 16
  },
  descriptionTitle: {
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 6
  },
  descriptionText: {
    color: '#475569',
    lineHeight: 20
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  errorTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  errorText: {
    color: '#64748b',
    textAlign: 'center'
  }
});

export default CarDetailScreen;
