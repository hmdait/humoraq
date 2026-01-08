import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';


const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: "G-1TTSQ15HXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics
let analytics = null;

const initAnalytics = async () => {
  try {
    // Check if analytics is supported in this environment
    const supported = await isAnalyticsSupported();
    
    if (supported) {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized successfully');
    } else {
      console.warn('⚠️ Firebase Analytics not supported in this environment');
    }
  } catch (error) {
    console.error('❌ Error initializing Analytics:', error);
  }
};

// Initialize analytics (async)
initAnalytics();

export { db, analytics };