import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';

const NotificationScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>알림 센터</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/alarm-set.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.notification}>
        <Text style={styles.notificationText}>웹프레임워크1 영상 시청까지 5시간 남았습니다.</Text>
      </View>
      <View style={styles.notification}>
        <Text style={styles.notificationText}>고급모바일프로그래밍 과제 제출까지 6시간 남았습니다.</Text>
      </View>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>알림 시간 설정</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.modalOption}>3시간 전</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.modalOption}>6시간 전</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.modalOption}>12시간 전</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.modalOption}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
    color: '#333',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  modalOption: {
    fontSize: 18,
    color: '#fff',
    padding: 10,
  },
});

export default NotificationScreen;
