import React from 'react';
import { View, Text, Button } from 'react-native';
import globalStyles from '../styles/globalStyles'; // Import style

export default function HomeScreen({ navigation }) {
  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Home Screen</Text>
      <Text style={globalStyles.text}>Welcome to the main screen!</Text>
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
}