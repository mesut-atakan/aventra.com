// firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref as storageRef } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAfkPiGwLZwvPQcTCFaQu-he7NjS4CG27U",
  authDomain: "aventra-platform.firebaseapp.com",
  projectId: "aventra-platform",
  storageBucket: "aventra-platform.appspot.com",
  messagingSenderId: "1044485055341",
  appId: "1:1044485055341:web:0bd3b3a2cecdded9423064",
  measurementId: "G-RZJ4H09WJW"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export Everything You Need
export { app, auth, db, storage, storageRef };