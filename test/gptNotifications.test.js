// gptNotifications.test.js
import { expect } from 'chai';
import { db } from '../src/firebase.js';
import generateGPTMessage from '../src/generateGPTMessage.js';

describe('GPT Notification Integration', () => {
  let tokenId;

  before(async () => {
    // FCM 토큰 테스트 데이터를 추가
    const tokenRef = await db.collection('fcmTokens').add({
      userId: 'testUser',
      token: 'testToken123',
      deviceInfo: 'Test Device',
    });
    tokenId = tokenRef.id;
  });

  after(async () => {
    // Firestore의 테스트 데이터 삭제
    if (tokenId) {
      await db.collection('fcmTokens').doc(tokenId).delete();
    }
  });

  it('should create a new FCM token for testing', async () => {
    expect(tokenId).to.exist;
  });

  it('should use GPT to generate and log a notification message', async () => {
    const prompt = `상황: 사용 제한 시간이 5분 남음, 잔여 시간이 얼마 남았는지 알림을 보내주세요.
    예를 들어 "제한 시간이 5분 남았습니다. 내일 또 다시 만날까요?" 이런 방식으로 작성해주세요`;
    const message = await generateGPTMessage(prompt);
    console.log(`Generated GPT Message: ${message}`);
    expect(message).to.include('제한 시간이 5분 남았습니다.');
  });
});
