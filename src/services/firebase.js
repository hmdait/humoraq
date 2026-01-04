import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "humoraq-ffb97.firebaseapp.com",
  projectId: "humoraq-ffb97",
  storageBucket: "humoraq-ffb97.firebasestorage.app",
  messagingSenderId: "84511525878",
  appId: process.env.VUE_APP_MYAPPID,
  measurementId: "G-1TTSQ15HXS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };