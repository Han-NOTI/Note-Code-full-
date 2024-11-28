const { Expo } = require('expo-server-sdk');
const express = require('express');
const app = express();
const expo = new Expo();

// JSON 데이터 파싱
app.use(express.json());

// 푸시 알림 API 엔드포인트
app.post('/send-notification', async (req, res) => {
  const { pushToken, title, body } = req.body;

  if (!Expo.isExpoPushToken(pushToken)) {
    return res.status(400).send('유효하지 않은 Push Token입니다.');
  }

  const messages = [
    {
      to: pushToken,
      sound: 'default',
      title: title || '기본 제목',
      body: body || '기본 메시지',
      data: { withSome: 'data' }, // 필요 시 추가 데이터
    },
  ];

  try {
    const tickets = await expo.sendPushNotificationsAsync(messages);
    console.log('푸시 알림 전송 성공:', tickets);
    res.status(200).send('푸시 알림이 성공적으로 전송되었습니다.');
  } catch (error) {
    console.error('푸시 알림 전송 실패:', error);
    res.status(500).send('푸시 알림 전송 실패');
  }
});

// 서버 실행
app.listen(3000, () => {
  console.log('푸시 알림 서버가 3000번 포트에서 실행 중입니다.');
});
