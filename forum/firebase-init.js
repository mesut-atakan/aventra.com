// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref as storageRef } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js"; // <--- ref ekleniyor

const firebaseConfig = {
  apiKey: "AIzaSyAfkPiGwLZwvPQcTCFaQu-he7NjS4CG27U",
  authDomain: "aventra-platform.firebaseapp.com",
  projectId: "aventra-platform",
  storageBucket: "aventra-platform.appspot.com",
  messagingSenderId: "1044485055341",
  appId: "1:1044485055341:web:0bd3b3a2cecdded9423064",
  measurementId: "G-RZJ4H09WJW"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { storageRef }; // ref fonksiyonu dýþa aktarýlýyor
