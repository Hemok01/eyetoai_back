// utils/pushNotificationHelper.js: 푸시 알림 전송 함수
import admin from 'firebase-admin';

export const sendPushNotification = (token, title, message) => {
  const messagePayload = {
    notification: {
      title: title,
      body: message,
    },
    token: token,
  };

  admin.messaging().send(messagePayload)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
};
