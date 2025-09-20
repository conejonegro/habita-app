// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXkPVNjUzPKiC-Sr4oxokPUXf6_FITzRc",
  authDomain: "habitah-6ccb2.firebaseapp.com",
  projectId: "habitah-6ccb2",
  storageBucket: "habitah-6ccb2.firebasestorage.app",
  messagingSenderId: "111017970460",
  appId: "1:111017970460:web:27edcc2e6519944e3d08d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };