// pushNotificationRoutes.test.js
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index.js'; // Express 서버 설정 파일 가져오기

describe('Push Notification Routes', () => {
  let tokenId;

  it('should create a new FCM token', async () => {
    const res = await request(app)
      .post('/api/fcmTokens')
      .send({
        userId: 'testUser',
        token: 'testToken123',
        deviceInfo: 'Test Device',
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    tokenId = res.body.id;
  });

  it('should retrieve the created FCM token', async () => {
    const res = await request(app).get(`/api/fcmTokens/${tokenId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token', 'testToken123');
  });

  it('should update the FCM token', async () => {
    const res = await request(app)
      .put(`/api/fcmTokens/${tokenId}`)
      .send({ token: 'updatedToken123' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'FCM 토큰이 업데이트되었습니다.');
  });

  it('should delete the FCM token', async () => {
    const res = await request(app).delete(`/api/fcmTokens/${tokenId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'FCM 토큰이 삭제되었습니다.');
  });
});
