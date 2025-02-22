import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvW7gOoc9AKO5FgGp0R1RqrD6xbFemV8g",
  authDomain: "anonymous-850ef.firebaseapp.com",
  databaseURL: "https://anonymous-850ef-default-rtdb.firebaseio.com",
  projectId: "anonymous-850ef",
  storageBucket: "anonymous-850ef.firebasestorage.app",
  messagingSenderId: "685550098415",
  appId: "1:685550098415:web:fc266eda777e0b2295881a",
  measurementId: "G-EKX08N2GWY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});