import React from 'react';
import { View, Text, Button } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Profile Screen</Text>
      <Text style={globalStyles.text}>This is your user profile</Text>
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
}