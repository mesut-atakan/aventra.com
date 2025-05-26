// forum/firebase-forum.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFXXqR4Xze-NAfccFCnDzDL7e-xcZGL9s",
  authDomain: "aventra-forum.firebaseapp.com",
  projectId: "aventra-forum",
  storageBucket: "aventra-forum.appspot.com",
  messagingSenderId: "813714185971",
  appId: "1:813714185971:web:cff1c9d2903ce3d7122186",
  measurementId: "G-FYYR18WRCP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global fonksiyon olarak tarayıcıya export
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
