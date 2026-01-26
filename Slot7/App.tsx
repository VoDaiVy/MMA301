import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MenuScreen } from './src/screens/MenuScreen';
import { TouchScreen } from './src/screens/TouchScreen';
import { RippleScreen } from './src/screens/RippleScreen';
import { LongPressScreen } from './src/screens/LongPressScreen';
import { NoFeedbackScreen } from './src/screens/NoFeedbackScreen';
import { KeyboardScreen } from './src/screens/KeyboardScreen';
import { PanResponderScreen } from './src/screens/PanResponderScreen';
import { RegisterFormScreen } from './src/screens/RegisterFormScreen';
import { View, Text } from 'react-native'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const InfoScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <Ionicons name="person-circle-outline" size={80} color="#6c5ce7" />
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Võ Đại Vỹ</Text>
    <Text style={{ color: '#636e72' }}>MSSV: DE180817</Text>
  </View>
);

const ExerciseStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#f8f9fd' } 
      }}
    >
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Touch" component={TouchScreen} />
      <Stack.Screen name="Ripple" component={RippleScreen} />
      <Stack.Screen name="LongPress" component={LongPressScreen} />
      <Stack.Screen name="NoFeedback" component={NoFeedbackScreen} />
      <Stack.Screen name="Keyboard" component={KeyboardScreen} />
      <Stack.Screen name="PanResponder" component={PanResponderScreen} />
      <Stack.Screen name="RegisterForm" component={RegisterFormScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeTab') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'InfoTab') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6c5ce7',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={ExerciseStack} 
          options={{ title: 'Bài Tập' }} 
        />
        <Tab.Screen 
          name="InfoTab" 
          component={InfoScreen} 
          options={{ title: 'Thông tin' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}