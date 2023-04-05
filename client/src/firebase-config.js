// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWN8dGYlAeYID1lv7Sc-CENj9m-RL4PBM",
  authDomain: "blossom-8a8cb.firebaseapp.com",
  projectId: "blossom-8a8cb",
  storageBucket: "blossom-8a8cb.appspot.com",
  messagingSenderId: "313045377208",
  appId: "1:313045377208:web:af52580468dca0e43c944d",
  measurementId: "G-T0W2YLF0YZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
