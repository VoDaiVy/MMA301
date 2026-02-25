// src/context/AppContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Bonus: Local Persistence
import { ROOMS } from '../data/mockData';
import { Colors } from '../constants/Colors';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Theme Logic
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'dark'

  // 2. Data Logic
  const [rooms, setRooms] = useState(ROOMS);
  const [bookings, setBookings] = useState([]);

  // Load dữ liệu khi mở app (Persistence Bonus)
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedBookings = await AsyncStorage.getItem('bookings');
        if (savedBookings) setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error('Failed to load bookings', e);
      }
    };
    loadData();
  }, []);

  // Lưu bookings mỗi khi có thay đổi
  useEffect(() => {
    AsyncStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Hàm chuyển đổi theme
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Lấy màu hiện tại
  const theme = Colors[themeMode];

  // Hàm thêm Booking (Logic cốt lõi)
  const addBooking = (newBooking) => {
    // newBooking gồm: id, roomId, purpose, date, startTime, endTime, participants, note, status
    setBookings((prev) => [newBooking, ...prev]); // Thêm vào đầu danh sách
  };

  // Hàm hủy Booking
  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
        rooms,
        bookings,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook custom để gọi context nhanh hơn
export const useApp = () => useContext(AppContext);