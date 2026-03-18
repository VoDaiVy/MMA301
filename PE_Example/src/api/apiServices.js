import axiosClient from './axiosClient';

const unwrap = response => response.data;

// Cars API: /api/v1/cars
export const getCars = async () => unwrap(await axiosClient.get('/cars'));
export const createCar = async payload => unwrap(await axiosClient.post('/cars', payload));

// Users API: /api/v1/users
export const getUsers = async () => unwrap(await axiosClient.get('/users'));
export const createUser = async payload => unwrap(await axiosClient.post('/users', payload));

// Bookings API: /api/v1/bookings
export const getBookings = async () => unwrap(await axiosClient.get('/bookings'));
export const createBooking = async payload => unwrap(await axiosClient.post('/bookings', payload));
export const getBookingById = async bookingId => unwrap(await axiosClient.get(`/bookings/${bookingId}`));
export const getBookingsByUser = async userId => unwrap(await axiosClient.get(`/bookings/user/${userId}`));
export const getOwnerBookings = async ownerId => unwrap(await axiosClient.get(`/bookings/owner/${ownerId}`));
export const getBookingAdminSummary = async () => unwrap(await axiosClient.get('/bookings/admin/summary'));

// Contracts API: /api/v1/contracts
export const getContracts = async () => unwrap(await axiosClient.get('/contracts'));
export const createContract = async payload => unwrap(await axiosClient.post('/contracts', payload));

const apiServices = {
  getCars,
  createCar,
  getUsers,
  createUser,
  getBookings,
  createBooking,
  getBookingById,
  getBookingsByUser,
  getOwnerBookings,
  getBookingAdminSummary,
  getContracts,
  createContract
};

export default apiServices;
