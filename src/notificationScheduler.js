// src/notificationScheduler.js
import admin from 'firebase-admin';
import { generateGPTMessage } from '../utils/gptHelper.js';

const db = admin.firestore();

// 푸시 알림을 보내는 함수
const sendPushNotification = (token, title, message) => {
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
export const checkUsageAndSendNotifications = async (admin, generateGPTMessage) => {
  const db = admin.firestore();
  try {
    const usageDocs = await db.collection('usage').get();
    for (const doc of usageDocs.docs) {
      const usageData = doc.data();
      const { childId, totalUsage, totalLimit } = usageData;
      const remainingTime = totalLimit - totalUsage;

      console.log(`Processing childId: ${childId}, remainingTime: ${remainingTime}`);

      if (remainingTime === 10 || remainingTime === 5) {
        const tokenDocs = await db.collection('fcmTokens').where('userId', '==', childId).get();
        for (const tokenDoc of tokenDocs.docs) {
          const fcmToken = tokenDoc.data().token;

          if (fcmToken) {
            const prompt = `상황: 사용 제한 시간이 ${remainingTime}분 남음, 잔여 시간이 얼마 남았는지 알림을 보내주세요. "제한 시간이 5분 남았습니다. 내일 또 다시 만날까요?" 이런 느낌으로 작성해주세요`;
            const message = await generateGPTMessage(prompt);

            const title = '사용 시간 경고';
            await admin.messaging().send({
              notification: {
                title: title,
                body: message,
              },
              token: fcmToken,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking usage and sending notifications:', error);
  }
};
