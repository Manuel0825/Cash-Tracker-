import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "cashtracker-26ea0.firebaseapp.com",
  projectId: "cashtracker-26ea0",
  storageBucket: "cashtracker-26ea0.appspot.com",
  messagingSenderId: "358752654638",
  appId: "1:358752654638:web:9020366c4d6eb9c0bf96bf"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);



export {
  db,
  storage,
  auth,
  
  
};

