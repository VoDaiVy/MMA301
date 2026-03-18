import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBooking, getCars } from '../api/apiServices';
import { useSelectedCar } from '../context/SelectedCarContext';

function QuickBookingScreen({ route, navigation }) {
  const { selectedCar: selectedCarInContext, setSelectedCar } = useSelectedCar();
  const selectedCarFromRoute = route?.params?.selectedCar || selectedCarInContext;

  const [availableCars, setAvailableCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  const [userId, setUserId] = useState('');
  const [carId, setCarId] = useState(selectedCarFromRoute?._id || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedCar = useMemo(() => {
    return availableCars.find(car => String(car._id) === String(carId));
  }, [availableCars, carId]);

  useEffect(() => {
    if (selectedCarFromRoute?._id && selectedCarFromRoute?._id !== selectedCarInContext?._id) {
      setSelectedCar(selectedCarFromRoute);
    }
  }, [selectedCarFromRoute, selectedCarInContext?._id, setSelectedCar]);

  useEffect(() => {
    if (selectedCarFromRoute?._id) {
      setCarId(String(selectedCarFromRoute._id));
    }
  }, [selectedCarFromRoute?._id]);

  const loadAvailableCars = async () => {
    setCarsLoading(true);
    try {
      const cars = await getCars();
      const onlyAvailable = (Array.isArray(cars) ? cars : []).filter(car => car.status === 'AVAILABLE');
      setAvailableCars(onlyAvailable);
    } catch (error) {
      Alert.alert('Load Cars Failed', error.message || 'Unable to load cars for booking.');
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailableCars();
  }, []);

  const validateInputs = () => {
    if (!userId.trim()) {
      Alert.alert('Missing User ID', 'Please enter a valid user ID.');
      return false;
    }

    if (!carId) {
      Alert.alert('Missing Car', 'Please select a car to book.');
      return false;
    }

    if (!startDate.trim() || !endDate.trim()) {
      Alert.alert('Missing Dates', 'Please fill both start and end date in YYYY-MM-DD format.');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      Alert.alert('Invalid Date', 'Dates must be valid and use format YYYY-MM-DD.');
      return false;
    }

    if (end < start) {
      Alert.alert('Invalid Date Range', 'End date must be after or equal to start date.');
      return false;
    }

    return true;
  };

  const handleCreateBooking = async () => {
    if (!validateInputs()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        userId: userId.trim(),
        carId,
        startDate,
        endDate,
        status: 'PENDING'
      };

      const createdBooking = await createBooking(payload);

      Alert.alert('Booking Created', `Booking ID: ${createdBooking._id}`);
      setStartDate('');
      setEndDate('');

      navigation.navigate('ManageRentals', { userId: userId.trim() });
    } catch (error) {
      Alert.alert('Create Booking Failed', error.message || 'Unable to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderCarOption = ({ item }) => {
    const isSelected = String(item._id) === String(carId);
    const hasImage = typeof item.image === 'string' && item.image.length > 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.carOption, isSelected && styles.carOptionSelected]}
        onPress={() => {
          setCarId(item._id);
          setSelectedCar(item);
        }}
      >
        {hasImage ? (
          <Image source={{ uri: item.image }} style={styles.carOptionImage} resizeMode="cover" />
        ) : (
          <View style={styles.carOptionImageFallback}>
            <Text style={styles.carOptionFallbackText}>{item.brand?.[0] || 'C'}{item.model?.[0] || 'R'}</Text>
          </View>
        )}

        <View style={styles.carOptionTextWrap}>
          <Text numberOfLines={1} style={[styles.carOptionTitle, isSelected && styles.carOptionTitleSelected]}>
            {item.brand} {item.model}
          </Text>
          <Text numberOfLines={1} style={[styles.carOptionSub, isSelected && styles.carOptionSubSelected]}>
            {Number(item.pricePerDay || 0).toLocaleString('vi-VN')} VND/day
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Quick Booking</Text>
          <Text style={styles.subtitle}>Create a booking in under 1 minute</Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>User ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter User ObjectId"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-03-20"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-03-22"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.carsHeaderRow}>
            <Text style={styles.label}>Select Available Car</Text>
            <TouchableOpacity onPress={loadAvailableCars}>
              <Text style={styles.reloadText}>Reload</Text>
            </TouchableOpacity>
          </View>

          {carsLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#0f172a" />
              <Text style={styles.loadingText}>Loading cars...</Text>
            </View>
          ) : (
            <FlatList
              data={availableCars}
              horizontal
              keyExtractor={item => String(item._id)}
              showsHorizontalScrollIndicator={false}
              renderItem={renderCarOption}
              contentContainerStyle={styles.carList}
              ListEmptyComponent={<Text style={styles.emptyCarsText}>No AVAILABLE cars found.</Text>}
            />
          )}

          {selectedCar ? (
            <View style={styles.selectedCarBox}>
              <Text style={styles.selectedCarTitle}>Selected Car</Text>
              <Text style={styles.selectedCarText}>
                {selectedCar.brand} {selectedCar.model} • {selectedCar.licensePlate}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
            onPress={handleCreateBooking}
            disabled={submitting}
          >
            <Text style={styles.primaryButtonText}>{submitting ? 'Creating Booking...' : 'Create Booking'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  keyboardWrap: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 28
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 12
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 12
  },
  label: {
    color: '#334155',
    fontWeight: '600',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#0f172a'
  },
  carsHeaderRow: {
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reloadText: {
    color: '#0f172a',
    fontWeight: '700'
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  loadingText: {
    color: '#475569'
  },
  carList: {
    paddingBottom: 6
  },
  carOption: {
    width: 220,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  carOptionSelected: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a'
  },
  carOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#dbeafe'
  },
  carOptionImageFallback: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center'
  },
  carOptionFallbackText: {
    color: '#1e3a8a',
    fontWeight: '800',
    fontSize: 18
  },
  carOptionTextWrap: {
    flex: 1
  },
  carOptionTitle: {
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 4
  },
  carOptionTitleSelected: {
    color: '#ffffff'
  },
  carOptionSub: {
    color: '#475569'
  },
  carOptionSubSelected: {
    color: '#cbd5e1'
  },
  emptyCarsText: {
    color: '#64748b',
    marginBottom: 10
  },
  selectedCarBox: {
    marginTop: 8,
    marginBottom: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    padding: 12
  },
  selectedCarTitle: {
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 2
  },
  selectedCarText: {
    color: '#334155',
    fontWeight: '600'
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryButtonDisabled: {
    opacity: 0.7
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  }
});

export default QuickBookingScreen;
