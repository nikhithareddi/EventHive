// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvMyJUV637MaRVfgfx336nl2wHons1-aA",
  authDomain: "sample-firebase-ai-app-f47e7.firebaseapp.com",
  projectId: "sample-firebase-ai-app-f47e7",
  storageBucket: "sample-firebase-ai-app-f47e7.firebasestorage.app",
  messagingSenderId: "606758242466",
  appId: "1:606758242466:web:1b0887cd82b52b9471effb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
