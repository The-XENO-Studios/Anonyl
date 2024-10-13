import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBp1bS2l2g4jzOATj-kz-ct8POurd3xfhU",
  authDomain: "anonyl.firebaseapp.com",
  projectId: "anonyl",
  storageBucket: "anonyl.appspot.com",
  messagingSenderId: "335604449712",
  appId: "1:335604449712:web:731762cf58cd62a8c1d675",
  measurementId: "G-M3QXLK8V9L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
