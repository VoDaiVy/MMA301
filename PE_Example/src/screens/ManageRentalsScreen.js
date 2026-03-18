import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookingsByUser } from '../api/apiServices';

const statusColors = {
  PENDING: '#d97706',
  CONFIRMED: '#1b8f3b',
  COMPLETED: '#1d4ed8',
  CANCELLED: '#b91c1c'
};

function ManageRentalsScreen({ route }) {
  const initialUserId = route?.params?.userId || '';

  const [userId, setUserId] = useState(initialUserId);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBookings = async (isRefreshing = false) => {
    if (!userId.trim()) {
      setBookings([]);
      setErrorMessage('Please enter a user ID to load rentals.');
      return;
    }

    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setErrorMessage('');
      const data = await getBookingsByUser(userId.trim());
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load rentals.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialUserId) {
      loadBookings();
    }
  }, [initialUserId]);

  const renderBooking = ({ item }) => {
    const hasPopulatedCar = item.carId && typeof item.carId === 'object';
    const carBrandModel = hasPopulatedCar ? `${item.carId.brand} ${item.carId.model}` : 'Unknown car';
    const carPlate = hasPopulatedCar ? item.carId.licensePlate : String(item.carId || 'N/A');
    const bookingStatus = item.status || 'PENDING';
    const statusColor = statusColors[bookingStatus] || '#334155';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{carBrandModel}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusBadgeText}>{bookingStatus}</Text>
          </View>
        </View>
        <Text style={styles.cardText}>Booking ID: {item._id}</Text>
        <Text style={styles.cardText}>Car/Plate: {carPlate}</Text>
        <Text style={styles.cardText}>Start: {new Date(item.startDate).toLocaleDateString()}</Text>
        <Text style={styles.cardText}>End: {new Date(item.endDate).toLocaleDateString()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Rentals</Text>
        <Text style={styles.subtitle}>Track booking status and schedule</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>User ID</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter User ObjectId"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity style={styles.searchButton} onPress={() => loadBookings(false)}>
              <Text style={styles.searchButtonText}>Load</Text>
            </TouchableOpacity>
          </View>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0f172a" />
            <Text style={styles.loadingText}>Loading rentals...</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={item => String(item._id)}
            renderItem={renderBooking}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={bookings.length === 0 ? styles.emptyListContainer : styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => loadBookings(true)} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No rentals found</Text>
                <Text style={styles.emptySubtitle}>Try another user ID or create a new booking first.</Text>
              </View>
            }
          />
        )}
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
    padding: 16
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
  searchRow: {
    flexDirection: 'row',
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a'
  },
  searchButton: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center'
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  errorText: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 8,
    color: '#475569'
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '700',
    flex: 1
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  statusBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12
  },
  cardText: {
    color: '#334155',
    marginBottom: 4
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16
  },
  emptyTitle: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16
  },
  emptySubtitle: {
    color: '#64748b',
    marginTop: 4
  }
});

export default ManageRentalsScreen;
