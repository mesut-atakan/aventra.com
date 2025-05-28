import { auth } from './firebase-auth.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const profileArea = document.querySelector('.profile-area');

function updateProfileArea(user) {
    if (user) {
        const photoURL = user.photoURL || 'assets/images/default-profile-photo.jpg';
        const displayName = user.displayName || user.email || 'Kullan�c�';

        profileArea.innerHTML = `
            <div class="profile-trigger" tabindex="0">
                <span class="user-name">${displayName}</span>
                <img src="${photoURL}" class="profile-photo" alt="Profil Foto�raf�"
                    onerror="this.onerror=null;this.src='assets/images/default-profile-photo.jpg';">
            </div>
            <div class="profile-slider">
                <button class="profile-slider-btn" onclick="window.location.href='/profile.html'">Profil</button>
                <button class="profile-slider-btn logout-btn">��k�� Yap</button>
            </div>
        `;

        // A�ma/kapama mant���
        const trigger = profileArea.querySelector('.profile-trigger');
        const slider = profileArea.querySelector('.profile-slider');
        const logoutBtn = profileArea.querySelector('.logout-btn');

        function openSlider(e) {
            e.stopPropagation();
            profileArea.classList.add('active');
        }
        function closeSlider() {
            profileArea.classList.remove('active');
        }

        // A�ma
        trigger.addEventListener('click', openSlider);
        trigger.addEventListener('keydown', function(e) {
            if (e.key === "Enter" || e.key === " ") openSlider(e);
        });

        // D��ar� t�kland���nda kapans�n
        document.addEventListener('click', closeSlider);
        slider.addEventListener('click', function(e) { e.stopPropagation(); });

        // ��k��
        logoutBtn.addEventListener('click', () => signOut(auth));
    } else {
        profileArea.innerHTML = `<button class="login-btn">Giri� Yap</button>`;
        document.querySelector('.login-btn').addEventListener('click', () => {
            window.location.href = "../forum/login.html"; // Veya giri� sayfan�n yolu neyse
        });
    }
}

function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
        alert("Giri� Ba�ar�s�z: " + error.message);
    });
}

// Auth de�i�imini dinle
onAuthStateChanged(auth, updateProfileArea);
