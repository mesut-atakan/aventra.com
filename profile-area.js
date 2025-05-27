import { auth } from './firebase-auth.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const profileArea = document.querySelector('.profile-area');

function updateProfileArea(user) {
    if (user) {
        const photoURL = user.photoURL || 'assets/images/default-profile-photo.jpg';
        const displayName = user.displayName || user.email || 'Kullanýcý';
        profileArea.innerHTML = `
            <span class="user-name">${displayName}</span>
            <a href="profil.html">
                <img src="${photoURL}" class="profile-photo" alt="Profil Fotoðrafý"
                    onerror="this.onerror=null;this.src='assets/images/default-profile-photo.jpg';">
            </a>
            <button class="logout-btn">Çýkýþ Yap</button>
        `;
        document.querySelector('.logout-btn').addEventListener('click', () => signOut(auth));
    } else {
        profileArea.innerHTML = `<button class="login-btn">Giriþ Yap</button>`;
        document.querySelector('.login-btn').addEventListener('click', loginWithGoogle);
    }
}

function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
        alert("Giriþ Baþarýsýz: " + error.message);
    });
}

// Auth deðiþimini dinle
onAuthStateChanged(auth, updateProfileArea);
