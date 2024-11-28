// sendPushNotification.js
import admin from 'firebase-admin';

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

export default sendPushNotification;
