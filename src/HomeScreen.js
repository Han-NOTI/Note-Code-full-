import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function HomeScreen({ route }) {
  const { courses } = route.params || {}; // 기본값을 빈 객체로 설정

  console.log('강좌 데이터:', courses);  // 추가된 디버깅 코드

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
        data={courses.filter(course => course.videos && course.videos.length > 0 || course.assignments && course.assignments.length > 0)} // 필터링 조건 수정
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item.course_title}</Text>
            {item.videos.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>수강 가능한 강의:</Text>
                <FlatList
                  data={item.videos}
                  keyExtractor={(video, idx) => idx.toString()}
                  renderItem={({ item: video }) => (
                    <Text style={styles.videoText}>- {video.title}</Text>
                  )}
                />
              </View>
            )}
            {item.assignments.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>제출해야 할 과제:</Text>
                <FlatList
                  data={item.assignments}
                  keyExtractor={(assignment, idx) => idx.toString()}
                  renderItem={({ item: assignment }) => (
                    <Text style={styles.assignmentText}>
                      - {assignment.title} (제출 여부: {assignment.submission_status})
                    </Text>
                  )}
                />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f9fc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  card: { padding: 15, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 },
  courseTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  videoText: { fontSize: 14, color: '#333' },
  assignmentText: { fontSize: 14, color: '#555' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});
