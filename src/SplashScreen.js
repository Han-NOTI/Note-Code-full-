import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    if (navigation) {
      setTimeout(() => {
        navigation.replace('Login'); // 2초 후 로그인 화면으로 이동
      }, 2000);
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>앱 로딩 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});