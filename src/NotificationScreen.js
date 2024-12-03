import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 센터</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{item.message}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.clearButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.clearButtonText}>알림 정리</Text>
      </TouchableOpacity>

      {/* 정리 모달 */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>모든 알림을 삭제하시겠습니까?</Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleClearNotifications}>
            <Text style={styles.modalButtonText}>삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  clearButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
  modalButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
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
