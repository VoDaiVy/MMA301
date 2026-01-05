import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    // Container tổng bên ngoài
    <View style={styles.container}>
      {/* Một cái hộp (card) màu trắng chứa nội dung bên trong */}
      <View style={styles.cardView}>
        {/* Dòng chữ tiêu đề */}
        <Text style={styles.titleText}>
          Xin chào Võ Đại Vỹ!
        </Text>
        {/* Dòng chữ nội dung nhỏ hơn */}
        <Text style={styles.subtitleText}>
          Chào mừng đến với môn MMA tại FPT University.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7', // Đổi nền tổng sang màu xám nhạt cho sang
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardView: {
    backgroundColor: '#FFFFFF', // Hộp màu trắng
    width: '85%',               // Chiều rộng bằng 85% màn hình
    padding: 25,                // Khoảng cách từ viền hộp vào chữ
    borderRadius: 20,           // Bo tròn góc của hộp
    // Các thuộc tính tạo đổ bóng (Shadow) cho đẹp
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Thuộc tính đổ bóng dành riêng cho Android
  },
  titleText: {
    fontSize: 24,               // Cỡ chữ to lên
    fontWeight: 'bold',         // Chữ đậm
    color: '#0056b3',           // Màu xanh dương đậm
    marginBottom: 10,           // Khoảng cách với dòng dưới
    textAlign: 'center',        // Căn giữa chữ
  },
  subtitleText: {
    fontSize: 16,               // Cỡ chữ vừa
    color: '#667085',           // Màu xám chữ
    textAlign: 'center',        // Căn giữa chữ
    lineHeight: 24,             // Khoảng cách giữa các dòng cho dễ đọc
  }
});