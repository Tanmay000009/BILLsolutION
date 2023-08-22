import admin from 'firebase-admin';
import { serviceAccountKey } from '../config/config';

const initFirebaseAdmin = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount)
  });

  console.log('Firebase Admin Initialized');
};

export default initFirebaseAdmin;
