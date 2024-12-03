import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { schedulePushNotification } from './pushNotifications';

const ManualScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      text: '수강중인 강의의 출석과 과제 제출 여부를 파악해 결석과 미제출을 알려드려요!',
      image: require('../assets/page-1.png'),
      buttonText: 'Next',
    },
    {
      text: '각각의 강의를 터치하면 상세 내용을 알아볼 수 있어요!',
      image: require('../assets/page-2.png'),
      buttonText: 'Next',
    },
    {
      text: '영상 출석 또는 과제 제출을 완료했다면 상단의 새로고침 버튼을 눌러 할일 목록을 갱신할 수 있어요!',
      image: require('../assets/page-3.png'),
      buttonText: 'Next',
    },
    {
      text: '사용자가 설정한 기한에 따라 마감 기한이 임박한 과제들을 알림으로 알려드려요!',
      image: require('../assets/page-4.png'),
      buttonText: 'Start',
    },
  ];

  const handleNext = async () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // 메뉴얼 완료 시 푸시 알림 예약
      await schedulePushNotification('알림 센터에 새로운 알림이 있습니다.', { seconds: 1 });

      // 홈 화면으로 이동
      navigation.replace('Main');
    }
  };

  const handleSkip = async () => {
    // 메뉴얼 건너뛰기 시 푸시 알림 예약
    await schedulePushNotification('알림 센터에 새로운 알림이 있습니다.', { seconds: 1 });

    // 홈 화면으로 이동
    navigation.replace('Main');
  };

  return (
    <View style={styles.manualContainer}>
      <View style={styles.pageContainer}>
        <Image source={pages[currentPage].image} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.pageText}>{pages[currentPage].text}</Text>
      </View>
      <View style={styles.navigationContainer}>
        {currentPage === 0 ? (
          <Button title="Skip" onPress={handleSkip} color="#000000" />
        ) : (
          <Button title="← Prev" onPress={() => setCurrentPage(currentPage - 1)} color="#000000" />
        )}
        <Image source={require('../assets/icon.png')} style={styles.icon} />
        <Button
          title={pages[currentPage].buttonText}
          onPress={handleNext}
          color="#000000"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  manualContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  pageContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: 130,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e0f7fa',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  icon: {
    width: 40,
    height: 50,
  },
});

export default ManualScreen;
