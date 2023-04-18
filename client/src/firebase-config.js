// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// blossom-dev
// const firebaseConfig = {
//   apiKey: "AIzaSyDeufL2TEO_Z9PVZ2EHDsakf2fUl70eWMo",
//   authDomain: "blossom-dev-65213.firebaseapp.com",
//   projectId: "blossom-dev-65213",
//   storageBucket: "blossom-dev-65213.appspot.com",
//   messagingSenderId: "688573040710",
//   appId: "1:688573040710:web:fd2d5f2a8ad6d0ce882247",
//   measurementId: "G-1LZNV5VNQX",
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
