import admin from 'firebase-admin';
import { serviceAccountKey } from '../config/config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const initFirebaseAdmin = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount)
  });

  const app = initializeApp({
    apiKey: 'AIzaSyDcy8P1b7Sv89MDbMhCZSCiSvPq3MtLCCY',
    authDomain: 'billsolution09.firebaseapp.com',
    projectId: 'billsolution09',
    storageBucket: 'billsolution09.appspot.com',
    messagingSenderId: '626970134296',
    appId: '1:626970134296:web:9cca8412d11046b0dbc06d'
  });

  const auth = getAuth(app);

  console.log('Firebase Admin Initialized');
};

export default initFirebaseAdmin;
