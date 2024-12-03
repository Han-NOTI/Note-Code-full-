import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import ManualScreen from './ManualScreen';
import HomeScreen from './HomeScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 푸시 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function TabNavigator({ route }) {
  const { courses } = route.params || {};
  const iconSize = { width: 70, height: 30, borderRadius: 100 };

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
          return <Image source={icon} style={{ ...iconSize }} />;
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { height: 65 },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ courses }}
        options={{
          title: 'Schedule',
          headerStyle: { height: 100 },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
            color: '#333',
            lineHeight: 40,
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          title: 'Alarm',
          headerStyle: { height: 100 },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
            color: '#333',
            lineHeight: 40,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerStyle: { height: 100 },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
            color: '#333',
            lineHeight: 40,
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const registerPushNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log('Expo Push Token:', token);
      }
    };

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      Alert.alert('푸시 알림', notification.request.content.body);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('알림 클릭:', response);
    });

    registerPushNotifications();

    // 리스너 해제
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showManual, setShowManual] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" options={{ headerShown: false }}>
          {(props) => <SplashScreen {...props} onLoaded={() => setLoaded(true)} />}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Manual" component={ManualScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 푸시 알림 권한 요청 및 토큰 가져오기
const registerForPushNotificationsAsync = async () => {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('푸시 알림 권한이 필요합니다.');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};
