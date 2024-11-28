import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>PROFILE</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Image source={require('../assets/user-icon.png')} style={styles.icon} />
            <Text style={styles.infoLabel}>이름</Text>
            <Text style={styles.infoText}>홍길동</Text>
          </View>
          <View style={styles.infoRow}>
            <Image source={require('../assets/id-icon.png')} style={styles.icon} />
            <Text style={styles.infoLabel}>학번</Text>
            <Text style={styles.infoText}>2412345</Text>
          </View>
          <View style={styles.infoRow}>
            <Image source={require('../assets/school-icon.png')} style={styles.icon} />
            <Text style={styles.infoLabel}>소속</Text>
            <Text style={styles.infoText}>모바일소프트웨어트랙</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#0C71B1',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ProfileScreen;
