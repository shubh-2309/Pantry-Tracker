// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPEm18DfB5JiI2uMiDM25jfvbUjygVyM8",
  authDomain: "pantry-tracker-843cc.firebaseapp.com",
  projectId: "pantry-tracker-843cc",
  storageBucket: "pantry-tracker-843cc.appspot.com",
  messagingSenderId: "900914313223",
  appId: "1:900914313223:web:c4597ac510b79ece3f92a2",
  measurementId: "G-LXYGQSYGKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };