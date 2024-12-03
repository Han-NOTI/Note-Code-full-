import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { dummyData } from './dummyData';

const calculateRemainingTime = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(`${new Date().getFullYear()}-${deadline}`);
  const diffMs = deadlineDate - now;

  if (diffMs <= 0) return '마감되었습니다.';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (diffDays > 0) {
    return `${diffDays}일 ${diffHours}시간 남음`;
  } else {
    return `${diffHours}시간 남음`;
  }
};

export default function HomeScreen({ route }) {
  const { courses = dummyData } = route.params || {}; // 기본값으로 dummyData 사용

  if (!courses || courses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>수강 가능한 강좌가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 제목 */}
      <View style={styles.header}>
        <Text style={styles.title}>강좌 목록</Text>
      </View>
      {/* 강좌 목록 */}
      <FlatList
        data={courses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item[0]?.courseName}</Text>
            {item.map((lecture, idx) => (
              <Text key={idx} style={styles.videoText}>
                - {lecture.lecture_title} ({lecture.lecture_length}) {'\n'}
                마감 기한: {lecture.deadline} {'\n'}
                남은 시간: {calculateRemainingTime(lecture.deadline)}
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
  card: {
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
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007BFF',
  },
  videoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
