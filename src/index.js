// index.js
import express from 'express';
import pushNotificationRoutes from '../routes/pushNotificationRoutes.js';
import { db } from './firebase.js';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/api', pushNotificationRoutes);

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

// 전체 테스트 실행 후 Firestore 종료를 위한 메서드
if (process.env.NODE_ENV === 'test') {
  after(async () => {
    await db.terminate();
  });
}

export default app;
