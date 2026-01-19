import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StudentListScreen } from '../screens/main/StudentListScreen';
import { TeacherListScreen } from '../screens/main/TeacherListScreen';
import { NewsScreen } from '../screens/main/NewsScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { COLORS, SHADOWS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -25,
      justifyContent: 'center',
      alignItems: 'center',
      ...SHADOWS.soft,
    }}
    onPress={onPress}
  >
    <View style={styles.middleIconContainer}>
      {children}
    </View>
  </TouchableOpacity>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="StudentList"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          position: 'absolute',
          bottom: 15,
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: COLORS.white,
          borderRadius: 25,
          height: 70,
          ...SHADOWS.soft,
          paddingBottom: 0,
        }
      }}
    >
      <Tab.Screen 
        name="StudentList" 
        component={StudentListScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
               <Ionicons name={focused ? "people" : "people-outline"} size={26} color={color} />
               {focused && <View style={styles.activeDot} />}
            </View>
          )
        }}
      />

      <Tab.Screen 
        name="TeacherList" 
        component={TeacherListScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
             <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
              <Ionicons name={focused ? "school" : "school-outline"} size={26} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          )
        }}
      />

      <Tab.Screen 
        name="LogoMiddle" 
        component={StudentListScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} onPress={() => Alert.alert("FPT University", "Chào mừng bạn đến với ứng dụng!")}>
               <Image 
                 source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/1200px-FPT_logo_2010.svg.png' }}
                 style={styles.logoImage} 
               />
            </CustomTabBarButton>
          )
        }}
      />

      <Tab.Screen 
        name="News" 
        component={NewsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
             <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
              <Ionicons name={focused ? "newspaper" : "newspaper-outline"} size={26} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          )
        }}
      />

      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
             <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
              <Ionicons name={focused ? "settings" : "settings-outline"} size={26} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  middleIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  logoImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
    marginTop: 4
  }
});