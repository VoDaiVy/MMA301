import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SearchCarsScreen from '../screens/SearchCarsScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import QuickBookingScreen from '../screens/QuickBookingScreen';
import ManageRentalsScreen from '../screens/ManageRentalsScreen';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, color, size) => {
  if (routeName === 'SearchCars') {
    return <Ionicons name="search" size={size} color={color} />;
  }

  if (routeName === 'ViewDetails') {
    return <Ionicons name="document-text-outline" size={size} color={color} />;
  }

  if (routeName === 'QuickBooking') {
    return <Ionicons name="flash" size={size} color={color} />;
  }

  if (routeName === 'ManageRentals') {
    return <MaterialIcons name="event-available" size={size} color={color} />;
  }

  return <Ionicons name="ellipse" size={size} color={color} />;
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="SearchCars"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1d4ed8',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 78,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff'
        },
        tabBarItemStyle: {
          paddingHorizontal: 2
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600'
        },
        tabBarIcon: ({ color, size }) => getTabIcon(route.name, color, size)
      })}
    >
      <Tab.Screen
        name="SearchCars"
        component={SearchCarsScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="ViewDetails"
        component={CarDetailScreen}
        options={{ tabBarLabel: 'Details' }}
      />
      <Tab.Screen
        name="QuickBooking"
        component={QuickBookingScreen}
        options={{ tabBarLabel: 'Booking' }}
      />
      <Tab.Screen
        name="ManageRentals"
        component={ManageRentalsScreen}
        options={{ tabBarLabel: 'Rentals' }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
