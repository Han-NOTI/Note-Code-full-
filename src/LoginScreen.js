import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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
      const response = await axios.post('http://192.168.35.1:5000/api/login', {
        username,
        password,
      });
      const courses = response.data;
      // 로그인 성공 시 매뉴얼 화면으로 이동
      navigation.navigate('Manual', { courses });
    } catch (err) {
      console.error('API Error:', err.message);

      // API 실패 시 더미 데이터 사용
      navigation.navigate('Manual', {
        courses: dummyData,
      });
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

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  logo: {
    width: '80%', // 화면 너비에 비례하여 로고 크기 설정
    height: undefined, // 높이를 자동으로 조정
    aspectRatio: 3, // 로고의 가로 세로 비율 고정 (예: 3:1)
    marginBottom: 40, // 아래 요소와 간격
    resizeMode: 'contain', // 로고 이미지 전체가 보이도록 설정
  },
  input: {
    width: '80%',
    height: 40,
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
    height: 40,
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
    marginTop: 50,
    borderRadius: 5,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
