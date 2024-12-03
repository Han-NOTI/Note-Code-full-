import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { dummyData } from './dummyData';
import { schedulePushNotification } from './pushNotifications';

const calculateRemainingTime = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(`${new Date().getFullYear()}-${deadline}`);
  const diffMs = deadlineDate - now;

  if (diffMs <= 0) return null;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return diffDays > 0 ? `${diffDays}일 ${diffHours}시간 남음` : `${diffHours}시간 남음`;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const upcomingNotifications = [];
    dummyData.forEach((courseGroup) => {
      const courseName = courseGroup[0]?.courseName || 'Unknown Course';
      courseGroup.forEach((lecture) => {
        const remainingTime = calculateRemainingTime(lecture.deadline);
        if (remainingTime) {
          const message = `${courseName} - ${lecture.lecture_title} 시청까지 ${remainingTime}`;
          const trigger = { seconds: 10 }; // 앱 실행 후 10초 뒤 알림
          schedulePushNotification(message, trigger);
          upcomingNotifications.push({ message });
        }
      });
    });
    setNotifications(upcomingNotifications);
  }, []);

  const handleClearNotifications = () => {
    setNotifications([]);
    setModalVisible(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{item.message}</Text>
          </View>
        )}
      />
      {/* 알림 시간 설정 모달 */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>알림 시간 설정</Text>
          {['3시간 전', '6시간 전', '12시간 전', '1일 전', '3일 전'].map((time, index) => (
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
                {time}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
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
