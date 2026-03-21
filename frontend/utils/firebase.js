// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-44632.firebaseapp.com",
  projectId: "vingo-food-delivery-44632",
  storageBucket: "vingo-food-delivery-44632.firebasestorage.app",
  messagingSenderId: "298491233565",
  appId: "1:298491233565:web:8e3a22af535fa2a32c0df4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {provider,auth}