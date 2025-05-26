import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfkPiGwLZwvPQcTCFaQu-he7NjS4CG27U",
  authDomain: "aventra-platform.firebaseapp.com",
  projectId: "aventra-platform",
  storageBucket: "aventra-platform.appspot.com",
  messagingSenderId: "1044485055341",
  appId: "1:1044485055341:web:0bd3b3a2cecdded9423064",
  measurementId: "G-RZJ4H09WJW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.createEntry = async function () {
  const title = document.getElementById('pageTitle').value;
  const content = document.getElementById('pageContent').innerHTML;

  if (title && content.trim() !== '') {
    try {
      await addDoc(collection(db, "forums"), {
        title,
        content,
        createdAt: serverTimestamp()
      });
      alert("Forum başarıyla Firestore'a kaydedildi.");
      document.getElementById('pageTitle').value = '';
      document.getElementById('pageContent').innerHTML = '';
    } catch (error) {
      console.error("Veri ekleme hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  } else {
    alert("Lütfen başlık ve içerik alanlarını doldurun.");
  }
};