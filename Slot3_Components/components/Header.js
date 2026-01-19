import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View>
      <Text style={styles.title}>React Native Components</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
