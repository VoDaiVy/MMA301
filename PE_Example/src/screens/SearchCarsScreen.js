import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCars } from '../api/apiServices';
import { useSelectedCar } from '../context/SelectedCarContext';

const statusColors = {
  AVAILABLE: '#1b8f3b',
  RENTED: '#d97706',
  MAINTENANCE: '#b91c1c'
};

function SearchCarsScreen({ navigation }) {
  const { setSelectedCar } = useSelectedCar();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const bookingDate = `${String(currentTime.getDate()).padStart(2, '0')}/${String(currentTime.getMonth() + 1).padStart(2, '0')}/${currentTime.getFullYear()}`;
  const bookingTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const loadCars = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setErrorMessage('');
      const data = await getCars();
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load cars.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const availableCars = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    const onlyAvailableCars = cars.filter(car => car.status === 'AVAILABLE');

    if (!keyword) {
      return onlyAvailableCars;
    }

    return onlyAvailableCars.filter(car => {
      const text = `${car.brand || ''} ${car.model || ''} ${car.licensePlate || ''}`.toLowerCase();
      return text.includes(keyword);
    });
  }, [cars, searchKeyword]);

  const renderCarItem = ({ item }) => {
    const badgeColor = statusColors[item.status] || '#334155';
    const initial = `${item.brand?.[0] || ''}${item.model?.[0] || ''}`.toUpperCase();
    const carTitle = `${item.brand || ''} ${item.model || ''}`.trim();
    const hasImage = typeof item.image === 'string' && item.image.length > 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text numberOfLines={1} style={styles.carName}>{carTitle}</Text>
          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          {hasImage ? (
            <Image
              source={{ uri: item.image }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnailBox}>
              <Text style={styles.thumbnailText}>{initial}</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <Text style={styles.metaText}>License Plate: {item.licensePlate}</Text>
            <Text style={styles.priceText}>{Number(item.pricePerDay || 0).toLocaleString('vi-VN')} VND/day</Text>
            <Text style={styles.ratingText}>4.9 ★★★★☆</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.rentButton}
            onPress={() => {
              setSelectedCar(item);
              navigation.navigate('CarDetail', { car: item });
            }}
          >
            <Text style={styles.rentButtonText}>Rent</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0f172a" />
          <Text style={styles.loadingText}>Loading available cars...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Search Cars</Text>
        <Text style={styles.subtitle}>Showing cars with status AVAILABLE</Text>

        <View style={styles.bookingContextCard}>
          <View style={styles.contextRowTop}>
            <Text style={styles.contextLabel}>Location</Text>
            <Text style={styles.contextValue}>Ha Noi</Text>
          </View>

          <View style={styles.contextRowBottom}>
            <View style={styles.contextPill}>
              <Text style={styles.contextPillLabel}>Date</Text>
              <Text style={styles.contextPillValue}>{bookingDate}</Text>
            </View>
            <View style={styles.contextPill}>
              <Text style={styles.contextPillLabel}>Time</Text>
              <Text style={styles.contextPillValue}>{bookingTime}</Text>
            </View>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by brand, model, or plate"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          autoCapitalize="none"
          placeholderTextColor="#94a3b8"
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <FlatList
          data={availableCars}
          keyExtractor={item => String(item._id)}
          renderItem={renderCarItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={availableCars.length === 0 ? styles.emptyListContainer : styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadCars(true)} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No available cars found</Text>
              <Text style={styles.emptySubtitle}>Try another keyword or update car status.</Text>
            </View>
          }
        />
      </View>
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
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 8
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  loadingText: {
    marginTop: 12,
    color: '#334155'
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 10,
    color: '#64748b'
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#0f172a',
    marginBottom: 12
  },
  bookingContextCard: {
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12
  },
  contextRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  contextLabel: {
    color: '#334155',
    fontWeight: '600'
  },
  contextValue: {
    color: '#0f172a',
    fontWeight: '700'
  },
  contextRowBottom: {
    flexDirection: 'row',
    gap: 8
  },
  contextPill: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  contextPillLabel: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 2
  },
  contextPillValue: {
    color: '#0f172a',
    fontWeight: '700'
  },
  errorText: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  listContainer: {
    paddingBottom: 20
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  thumbnailBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnailImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#e2e8f0'
  },
  thumbnailText: {
    color: '#1e3a8a',
    fontWeight: '800',
    fontSize: 16
  },
  cardInfo: {
    flex: 1
  },
  carName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    paddingRight: 8
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  statusText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12
  },
  metaText: {
    color: '#475569',
    marginBottom: 6
  },
  priceText: {
    color: '#0f172a',
    fontWeight: '700'
  },
  ratingText: {
    marginTop: 4,
    color: '#475569',
    fontSize: 12
  },
  rentButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  rentButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a'
  },
  emptySubtitle: {
    marginTop: 4,
    color: '#64748b'
  }
});

export default SearchCarsScreen;
