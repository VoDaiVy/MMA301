// src/constants/Colors.js

// 1. Bảng màu gốc (Palette) - Chỉnh mã màu Hex tại đây
const Palette = {
  fptOrange: '#F27125',  // Màu cam thương hiệu
  darkGray: '#1F2937',
  lightGray: '#F9FAFB',
  white: '#FFFFFF',
  
  // Màu chức năng
  success: '#10B981',    // Xanh lá (Phòng trống, Thành công)
  info: '#3B82F6',       // Xanh dương (Thông tin, Booking)
  warning: '#F59E0B',    // Vàng (Đang chờ duyệt)
  error: '#EF4444',      // Đỏ (Đã đặt, Lỗi)
  
  // Màu nền mờ (dùng cho background icon)
  successLight: 'rgba(16, 185, 129, 0.15)',
  infoLight: 'rgba(59, 130, 246, 0.15)',
  orangeLight: 'rgba(242, 113, 37, 0.15)',
};

// 2. Mapping theo Theme (Sáng/Tối)
export const Colors = {
  light: {
    background: Palette.lightGray,
    card: Palette.white,
    text: Palette.darkGray,
    subText: '#6B7280',
    primary: Palette.fptOrange,
    border: '#E5E7EB',
    
    // Các màu chức năng dùng chung
    success: Palette.success,
    error: Palette.error,
    info: Palette.info,
    warning: Palette.warning,
    
    // Màu UI cụ thể
    iconBackground: '#F3F4F6',
    bannerBackground: Palette.fptOrange,
  },
  dark: {
    background: '#111827',
    card: '#1F2937',
    text: Palette.lightGray,
    subText: '#9CA3AF',
    primary: Palette.fptOrange,
    border: '#374151',
    
    success: '#34D399', // Màu sáng hơn chút cho nền đen
    error: '#F87171',
    info: '#60A5FA',
    warning: '#FBBF24',

    iconBackground: '#374151',
    bannerBackground: '#C2410C', // Cam đậm hơn cho đỡ chói mắt ban đêm
  },
};