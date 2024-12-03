import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { dummyData } from './dummyData';

const calculateRemainingTime = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(`${new Date().getFullYear()}-${deadline}`);
  const diffMs = deadlineDate - now;

  if (diffMs <= 0) return null;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return diffDays > 0 ? diffDays * 24 + diffHours : diffHours; // 남은 시간을 시간 단위로 반환
};

export default function HomeScreen({ route }) {
  const { courses = dummyData } = route.params || {}; // 기본값으로 dummyData 사용

  // 강좌 정렬
  const sortedCourses = courses.map((group) =>
    group.sort((a, b) => {
      const remainingA = calculateRemainingTime(a.deadline);
      const remainingB = calculateRemainingTime(b.deadline);

      if (remainingA === null && remainingB === null) return 0; // 둘 다 마감된 경우 순서 유지
      if (remainingA === null) return 1; // 마감된 강좌는 뒤로
      if (remainingB === null) return -1; // 마감된 강좌는 뒤로

      return remainingA - remainingB; // 남은 시간 오름차순 정렬
    })
  );

  if (!sortedCourses || sortedCourses.length === 0) {
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
        data={sortedCourses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item[0]?.courseName}</Text>
            {item.map((lecture, idx) => (
              <Text key={idx} style={styles.videoText}>
                - {lecture.lecture_title} ({lecture.lecture_length}) {'\n'}
                마감 기한: {lecture.deadline} {'\n'}
                남은 시간: {calculateRemainingTime(lecture.deadline) !== null
                  ? `${Math.floor(calculateRemainingTime(lecture.deadline) / 24)}일 ${calculateRemainingTime(lecture.deadline) % 24}시간 남음`
                  : '마감되었습니다.'}
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
