import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
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
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
