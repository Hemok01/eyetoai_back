// firebase.js
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: "json" };
import { databaseURL } from '../config.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

const db = admin.firestore();

export { db };
