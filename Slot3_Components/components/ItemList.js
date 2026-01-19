import { View, Text, StyleSheet } from 'react-native';

export default function ItemList({ items }) {
  return (
    <>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
});
