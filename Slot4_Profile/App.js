import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'; // Bỏ StyleSheet ở đây nếu không dùng nữa
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles'; 

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={[styles.largeButton, styles.buttonWhite]}
          onPress={() => navigation.navigate('Details')}
        >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.largeButton, styles.buttonBlue]}
          onPress={() => console.log('Home button pressed')}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => console.log('Back pressed')}>
            <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.bottomBarTitle}>Home</Text>
        
        <TouchableOpacity onPress={() => console.log('Search pressed')}>
            <Ionicons name="search" size={28} color="black" />
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={styles.centerScreen}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Details Screen</Text>
      <TouchableOpacity
          style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}
          onPress={() => navigation.goBack()}
      >
          <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Profile',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24,
            }
          }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}