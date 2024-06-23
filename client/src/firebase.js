// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:  import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d9ab8.firebaseapp.com",
  projectId: "mern-blog-d9ab8",
  storageBucket: "mern-blog-d9ab8.appspot.com",
  messagingSenderId: "900502236308",
  appId: "1:900502236308:web:520e276575012c3c891881",
  measurementId: "G-Q80718VPKL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
