import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };

// SADECE AÞAÐIDAKÝ GÝBÝ OTOMATÝK USER EKLEME FONKSÝYONUNU DA BURADA TUT
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// KESÝNLÝKLE TEKRAR "import { auth } from './firebase-auth.js'" YAPMA! 
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        photoURL: user.photoURL || "/assets/images/default-profile-photo.jpg"
      });
    }
  }
});
