import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
const [count, setCount] = React.useState(1);
  return (
    // <View style={styles.container}>
    // <Text> Open up App.js to start working on your app!</Text>
    // <StatusBar style="auto" />
    // </View>
    <View style={styles.container}>
      <Text> {count} </Text>
      <Button title="Increase Count" onPress={() => setCount(count + 1)} />
      <Button title="Decrease Count" onPress={() => setCount(count - 1 >= 0 ? count - 1 : 0)} />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
