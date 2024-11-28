import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ route }) {
  const { courses } = route.params || {}; // 강좌 데이터를 전달받음

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Home') {
            icon = focused
              ? require('../assets/home-1.png')
              : require('../assets/home-2.png');
          } else if (route.name === 'Notifications') {
            icon = focused
              ? require('../assets/alarm-1.png')
              : require('../assets/alarm-2.png');
          } else if (route.name === 'Profile') {
            icon = focused
              ? require('../assets/profile-1.png')
              : require('../assets/profile-2.png');
          }
          return <Image source={icon} style={{ width: 24, height: 24 }} />;
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ courses }} options={{ title: '강좌 목록' }} />
      <Tab.Screen name="Notifications" component={NotificationScreen} options={{ title: '알림' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '프로필' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
