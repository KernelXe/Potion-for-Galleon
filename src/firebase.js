import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA46_WyK-LTTXZzmKH7CK2wQUKINflj17U",
  authDomain: "potion-for-galleon-fdd46.firebaseapp.com",
  projectId: "potion-for-galleon-fdd46",
  storageBucket: "potion-for-galleon-fdd46.firebasestorage.app",
  messagingSenderId: "757248208529",
  appId: "1:757248208529:web:bb4c8711fa0326a5e85930"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
