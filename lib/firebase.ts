// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUwSlqGfisUtejDfF8Snv-EzI374vcuus",
  authDomain: "ai-assistant-22f53.firebaseapp.com",
  projectId: "ai-assistant-22f53",
  storageBucket: "ai-assistant-22f53.firebasestorage.app",
  messagingSenderId: "249932268224",
  appId: "1:249932268224:web:559d39b570c1dc18082325",
  measurementId: "G-97SQS8BW2W"
};

// Initialize Firebase
import { getApps, getApp } from "firebase/app";

const app = getApps().find(a => a.name === '[DEFAULT]') || initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

// Initialize Guest App (Isolated session for Chatbot Visitor)
// This prevents the chatbot anonymous session from overwriting the Admin session on localhost (same domain)
const guestApp = getApps().find(app => app.name === "guest") || initializeApp(firebaseConfig, "guest");
const guestDb = getFirestore(guestApp);
const guestAuth = getAuth(guestApp);

export { app, db, auth, storage, guestApp, guestDb, guestAuth };
