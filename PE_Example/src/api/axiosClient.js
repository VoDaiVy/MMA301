import axios from 'axios';

// For a real device, set EXPO_PUBLIC_API_BASE_URL to your machine LAN IP,
// for example: http://192.168.1.10:3000/api/v1
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    const isNetworkError = !error?.response && error?.message === 'Network Error';
    const message = isNetworkError
      ? `Network Error: cannot reach API at ${API_BASE_URL}. Make sure backend is running and phone uses same Wi-Fi.`
      : error?.response?.data?.message || error?.response?.data?.error || error.message;
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
