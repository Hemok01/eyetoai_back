import * as td from 'testdouble';
import { expect } from 'chai';
import { checkUsageAndSendNotifications } from '../src/notificationScheduler.js';

describe('checkUsageAndSendNotifications', () => {
  let adminMock;
  let generateGPTMessageMock;

  beforeEach(() => {
    // Firestore 모의 객체 설정
    const firestoreMock = {
      collection: td.function(),
    };

    const usageDataCollectionMock = {
      get: td.function(),
    };

    const fcmTokensCollectionMock = {
      where: td.function(),
    };

    const fcmTokensWhereMock = {
      get: td.function(),
    };

    td.when(firestoreMock.collection('usage')).thenReturn(usageDataCollectionMock);
    td.when(firestoreMock.collection('fcmTokens')).thenReturn(fcmTokensCollectionMock);
    td.when(fcmTokensCollectionMock.where('userId', '==', 'child1')).thenReturn(fcmTokensWhereMock);

    // Firebase Messaging 모의 객체 설정
    const messagingMock = {
      send: td.function(),
    };

    // admin 모의 객체 설정
    adminMock = {
      firestore: () => firestoreMock,
      messaging: () => messagingMock,
    };

    // generateGPTMessage 함수 모의화
    generateGPTMessageMock = td.function();
    td.when(generateGPTMessageMock(td.matchers.anything())).thenResolve('Test message');
  });

  afterEach(() => {
    td.reset();
  });

  it('남은 시간이 5분 또는 10분일 때 알림을 전송해야 합니다.', async () => {
    // 남은 시간이 5분인 경우의 모의 데이터
    const usage = {
      childId: 'child1',
      totalUsage: 55, // 분 단위
      totalLimit: 60, // 분 단위
    };

    const fcmTokenData = { token: 'fcmToken1' };

    const firestoreMock = adminMock.firestore();
    td.when(firestoreMock.collection('usage').get()).thenResolve({
      docs: [{ data: () => usage }],
    });

    td.when(fcmTokensWhereMock.get()).thenResolve({
      docs: [{ data: () => fcmTokenData }],
    });

    await checkUsageAndSendNotifications(adminMock, generateGPTMessageMock);

    td.verify(generateGPTMessageMock(td.matchers.anything()), { times: 1 });
    td.verify(adminMock.messaging().send(td.matchers.anything()), { times: 1 });
  });
});
