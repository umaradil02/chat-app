
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAwdBhKIU9pdeF8tImKPh7Ht4JeYZJtEz8",
  authDomain: "practice-app-208cb.firebaseapp.com",
  projectId: "practice-app-208cb",
  storageBucket: "practice-app-208cb.appspot.com",
  messagingSenderId: "870734375297",
  appId: "1:870734375297:web:da19763b16bc34d786e080",
  measurementId: "G-EQDCHBSCSQ"
};


 export const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 export const db = getFirestore(app)