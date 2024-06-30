import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_bJSVFHsMZssuvfVRLtPW_KBL8eAt0qM",
  authDomain: "orbital-e1cb7.firebaseapp.com",
  projectId: "orbital-e1cb7",
  storageBucket: "orbital-e1cb7.appspot.com",
  messagingSenderId: "590550796527",
  appId: "1:590550796527:web:13b6b04fb95d873742331a",
  measurementId: "G-W8S4DKKXXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, storage };
