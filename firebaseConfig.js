import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Те же данные, что и в website/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAa3lHbLP1Emww3FVpsZeg7Y7140HvpPWo",
  authDomain: "anew-shop.firebaseapp.com",
  projectId: "anew-shop",
  storageBucket: "anew-shop.firebasestorage.app",
  messagingSenderId: "145036340870",
  appId: "1:145036340870:web:03f6beea33ffbd188feb07",
  measurementId: "G-835PV1WQF5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
