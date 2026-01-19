import { View, Text, Image, StyleSheet } from 'react-native';

export default function ProfileCard() {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://i.pinimg.com/1200x/12/f2/e3/12f2e3f218df30a26e8a5d0141682f71.jpg' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Vo Dai Vy</Text>
      <Text style={styles.desc}>Learning React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  desc: {
    color: '#777',
    marginTop: 4,
  },
});
