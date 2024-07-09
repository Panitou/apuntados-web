// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebase_key = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: firebase_key,
  authDomain: "apunta2-web.firebaseapp.com",
  projectId: "apunta2-web",
  storageBucket: "apunta2-web.appspot.com",
  messagingSenderId: "703236273065",
  appId: "1:703236273065:web:4a02650b7af2bb5c534ab8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
