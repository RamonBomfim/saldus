import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBR06BX7zc56AaUSSytxfjgg7n9algETl4",
  authDomain: "meusaldus.firebaseapp.com",
  projectId: "meusaldus",
  storageBucket: "meusaldus.firebasestorage.app",
  messagingSenderId: "575943004858",
  appId: "1:575943004858:web:795dd7f80996664528e883"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };