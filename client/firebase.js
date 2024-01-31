// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-75c15.firebaseapp.com",
  projectId: "mern-blog-75c15",
  storageBucket: "mern-blog-75c15.appspot.com",
  messagingSenderId: "705117938029",
  appId: "1:705117938029:web:de2ede6036690d24143a64"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);