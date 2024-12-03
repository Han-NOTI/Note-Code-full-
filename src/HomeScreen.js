import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { dummyData } from './dummyData';

const calculateRemainingTime = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(`${new Date().getFullYear()}-${deadline}`);
  const diffMs = deadlineDate - now;

  if (diffMs <= 0) return '마감되었습니다.';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 0) {
    return `${diffDays}일 ${diffHours}시간 남음`;
  } else {
    return `${diffHours}시간 남음`;
  }
};

export default function HomeScreen({ route }) {
  const { courses } = route.params || dummyData;

  if (!courses || courses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>수강 가능한 강좌가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 "Schedule" 제목 */}
      <Text style={styles.header}>강좌 목록</Text>
      {/* 강좌 목록 */}
      <FlatList
        data={courses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item[0]?.courseName}</Text>
            {item.map((lecture, idx) => (
              <Text key={idx} style={styles.videoText}>
                - {lecture.lecture_title} 마감기한까지 {calculateRemainingTime(lecture.deadline)}
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
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'left', // 왼쪽 정렬
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
    color: '#007BFF',
    textAlign: 'left', // 왼쪽 정렬
  },
  videoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left', // 왼쪽 정렬
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

