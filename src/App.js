import React, { useEffect, useState } from 'react';
import React, { useState } from 'react';
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
  const { courses } = route.params || {}; // 강좌 데이터를 전달받음
  const iconSize = { width: 70, height: 30, borderRadius: 100 }; // 아이콘 크기 설정

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
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          height: 65, // 하단 네비게이션 바 높이 조정
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ courses }}
        options={{
          title: 'Schedule', // 제목 설정
          headerStyle: {
            height: 100, // 상단 바 높이 증가
          },
          headerTitleAlign: 'center', // 제목 중앙 정렬
          headerTitleStyle: {
            fontSize: 30, // 제목 글씨 크기
            fontWeight: 'bold', // 글씨 두께
            color: '#333', // 글씨 색상
            lineHeight: 40, // 텍스트 높이 조정
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          title: 'Alarm',
          headerStyle: {
            height: 100, // 상단 바 높이 증가
          },
          headerTitleAlign: 'center', // 제목 중앙 정렬
          headerTitleStyle: {
            fontSize: 30, // 제목 글씨 크기
            fontWeight: 'bold', // 글씨 두께
            color: '#333', // 글씨 색상
            lineHeight: 40, // 텍스트 높이 조정
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerStyle: {
            height: 100, // 상단 바 높이 증가
          },
          headerTitleAlign: 'center', // 제목 중앙 정렬
          headerTitleStyle: {
            fontSize: 30, // 제목 글씨 크기
            fontWeight: 'bold', // 글씨 두께
            color: '#333', // 글씨 색상
            lineHeight: 40, // 텍스트 높이 조정
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const registerPushNotifications = async () => {
      // 권한 요청 및 Expo Push Token 가져오기
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log('Expo Push Token:', token);
      }
    };

    const setupNotificationListeners = () => {
      // 알림 수신 리스너
      Notifications.addNotificationReceivedListener((notification) => {
        Alert.alert('푸시 알림', notification.request.content.body);
      });

      // 알림 클릭 리스너
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('알림 클릭:', response);
      });
    };

    registerPushNotifications();
    setupNotificationListeners();

    return () => {
      Notifications.removeAllNotificationListeners();
    };
  }, []);

  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showManual, setShowManual] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" options={{ headerShown: false }}>
          {(props) => (
            <SplashScreen {...props} onLoaded={() => setLoaded(true)} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Manual"
          component={ManualScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
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
