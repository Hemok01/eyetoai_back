// pushNotificationRoutes.js
import express from 'express';
import { db } from '../src/firebase.js';

const router = express.Router();

// FCM 토큰 생성 (등록)
router.post('/fcmTokens', async (req, res) => {
  try {
    const { userId, token, deviceInfo } = req.body;
    const newTokenRef = await db.collection('fcmTokens').add({
      userId,
      token,
      deviceInfo,
    });
    res.status(201).json({ message: 'FCM 토큰이 등록되었습니다.', id: newTokenRef.id });
  } catch (error) {
    console.error('FCM 토큰 등록 중 오류 발생:', error);
    res.status(500).json({ error: 'FCM 토큰 등록 중 오류가 발생했습니다.' });
  }
});

// FCM 토큰 조회
router.get('/fcmTokens/:id', async (req, res) => {
  try {
    const tokenId = req.params.id;
    const tokenDoc = await db.collection('fcmTokens').doc(tokenId).get();
    if (tokenDoc.exists) {
      res.status(200).json(tokenDoc.data());
    } else {
      res.status(404).json({ error: 'FCM 토큰을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('FCM 토큰 조회 중 오류 발생:', error);
    res.status(500).json({ error: 'FCM 토큰 조회 중 오류가 발생했습니다.' });
  }
});

// FCM 토큰 업데이트
router.put('/fcmTokens/:id', async (req, res) => {
  try {
    const tokenId = req.params.id;
    const updatedData = req.body;
    await db.collection('fcmTokens').doc(tokenId).update(updatedData);
    res.status(200).json({ message: 'FCM 토큰이 업데이트되었습니다.' });
  } catch (error) {
    console.error('FCM 토큰 업데이트 중 오류 발생:', error);
    res.status(500).json({ error: 'FCM 토큰 업데이트 중 오류가 발생했습니다.' });
  }
});

// FCM 토큰 삭제
router.delete('/fcmTokens/:id', async (req, res) => {
  try {
    const tokenId = req.params.id;
    await db.collection('fcmTokens').doc(tokenId).delete();
    res.status(200).json({ message: 'FCM 토큰이 삭제되었습니다.' });
  } catch (error) {
    console.error('FCM 토큰 삭제 중 오류 발생:', error);
    res.status(500).json({ error: 'FCM 토큰 삭제 중 오류가 발생했습니다.' });
  }
});

export default router;
