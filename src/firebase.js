// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB8WArdhCegZE4pI4RMWwV-g1JSO5OKn0",
  authDomain: "bzuf-39f23.firebaseapp.com",
  projectId: "bzuf-39f23",
  storageBucket: "bzuf-39f23.firebasestorage.app",
  messagingSenderId: "989322854912",
  appId: "1:989322854912:web:4460a399943ed1a099cee5",
  measurementId: "G-P9T66XWCNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();