import admin from 'firebase-admin';
import { serviceAccountKey } from '../config/config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const initFirebaseAdmin = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount)
  });

  const app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
    appId: process.env.FIREBASE_APPID
  });

  const auth = getAuth(app);

  console.log('Firebase Admin Initialized');
};

export default initFirebaseAdmin;
