import React from 'react';
import { View, Text, Button } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Settings Screen</Text>
      <Text style={globalStyles.text}>Adjust your app settings here</Text>
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
}