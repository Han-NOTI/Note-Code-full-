import * as Notifications from 'expo-notifications';

export const schedulePushNotification = async (message, trigger) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '강의 알림',
        body: message,
        data: { message },
      },
      trigger,
    });
    console.log('푸시 알림 예약 성공:', message);
  } catch (error) {
    console.error('푸시 알림 예약 실패:', error);
  }
};
