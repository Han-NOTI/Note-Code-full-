import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dummyData } from './dummyData';
import { schedulePushNotification } from './pushNotifications';

const calculateRemainingTime = (deadline) => {
  const now = new Date();
  const currentYear = new Date().getFullYear();
  const deadlineDate = new Date(`${currentYear}-${deadline}`); // 데드라인 파싱

  const diffMs = deadlineDate - now; // 데드라인과 현재 시간 차이 계산
  if (diffMs <= 0) return null; // 이미 시간이 지났다면 null 반환

  const diffMinutes = Math.ceil(diffMs / (1000 * 60)); // 분 단위로 차이 계산
  const roundedHours = Math.round(diffMinutes / 60); // 30분 단위 반올림

  return roundedHours; // 남은 시간을 반환
};



const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(3); // 기본 알림 시간 3시간
  const scheduledMessages = useRef(new Set());

  useEffect(() => {
    const loadSelectedTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('selectedTime');
        if (storedTime !== null) {
          setSelectedTime(parseInt(storedTime, 10));
        }
      } catch (error) {
        console.error('시간 설정 로드 실패:', error);
      }
    };

    loadSelectedTime();
  }, []);

  useEffect(() => {
    const filterAndScheduleNotifications = async () => {
      const filteredNotifications = [];
      const newScheduledMessages = new Set(); // 새로운 알림 데이터를 저장하기 위한 Set
    
      dummyData.forEach((courseGroup) => {
        const courseName = courseGroup[0]?.courseName || 'Unknown Course';
    
        courseGroup.forEach((lecture) => {
          const remainingTime = calculateRemainingTime(lecture.deadline);
    
          // 남은 시간이 선택한 알림 시간 이내에만 필터링
          if (remainingTime !== null && remainingTime <= selectedTime) {
            const message = `${courseName} - ${lecture.lecture_title} 시청까지 ${remainingTime}시간 남음`;
    
            // 중복 메시지 확인
            if (!scheduledMessages.current.has(message)) {
              scheduledMessages.current.add(message); // 현재 Set에 추가
              newScheduledMessages.add(message); // 새로운 Set에도 추가
              filteredNotifications.push({ id: `${lecture.lecture_title}-${lecture.deadline}`, message });
    
              // 푸시 알림 예약
              const triggerTime = new Date();
              triggerTime.setHours(triggerTime.getHours() + remainingTime);
              schedulePushNotification(message, { date: triggerTime });
            }
          }
        });
      });
    
      console.log('필터링된 알림:', filteredNotifications);
      setNotifications(filteredNotifications); // 상태 업데이트
    };
    
    

    filterAndScheduleNotifications();
  }, [selectedTime]);

  const handleTimeSelect = async (time) => {
    try {
      await AsyncStorage.setItem('selectedTime', time.toString());
      setSelectedTime(time);
      setModalVisible(false);
    } catch (error) {
      console.error('시간 설정 저장 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>알림 센터</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/alarm-set.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{item.message}</Text>
          </View>
        )}
      />
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>알림 시간 설정</Text>
          {[3, 6, 12, 24, 72].map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.radioButton,
                selectedTime === time && styles.radioButtonSelected,
              ]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  selectedTime === time && styles.radioButtonTextSelected,
                ]}
              >
                {time === 24 ? '1일 전' : time === 72 ? '3일 전' : `${time}시간 전`}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
  notification: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  radioButton: {
    width: '60%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#007BFF',
  },
  radioButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  radioButtonTextSelected: {
    color: '#fff',
  },
  modalButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '60%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default NotificationScreen;
