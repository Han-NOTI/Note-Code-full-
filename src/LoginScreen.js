import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import axios from 'axios';
import { dummyData } from './dummyData';

// LoginScreen 컴포넌트
export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      // API 요청
      const response = await axios.post('http://192.168.35.102:5000/api/login', {
        username,
        password,
      });
      const courses = response.data;
      navigation.navigate('Main', { screen: 'Home', params: { courses } });
    } catch (err) {
      console.error('API Error:', err.message);

      // API 실패 시 더미 데이터 사용
      navigation.navigate('Main', { screen: 'Home', params: { courses: dummyData } });
    }
  };

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* 사용자 입력 */}
      <TextInput
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        {/* 비밀번호 표시/숨기기 버튼 */}
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.passwordToggle}
        >
          <Image
            source={
              showPassword
                ? require('../assets/show-pass.png') // 비밀번호 표시 아이콘
                : require('../assets/blind-pass.png') // 비밀번호 숨기기 아이콘
            }
            style={styles.toggleIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 에러 메시지 */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* 로그인 버튼 */}
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

// HomeScreen 컴포넌트
export function HomeScreen({ route }) {
  const { courses } = route.params || dummyData; // 더미 데이터 기본값 사용

  if (!courses || courses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>수강 가능한 강좌가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>강좌 목록</Text>
      <FlatList
        data={courses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item[0]?.courseName}</Text>
            {item.map((lecture, idx) => (
              <Text key={idx} style={styles.videoText}>
                - {lecture.lecture_title} ({lecture.lecture_length}, 마감: {lecture.deadline})
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  logo: {
    width: 150, // 로고 이미지 너비
    height: 50, // 로고 이미지 높이
    marginBottom: 40, // 아래 요소와 간격
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  passwordToggle: {
    padding: 10,
  },
  toggleIcon: {
    width: 20,
    height: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});
