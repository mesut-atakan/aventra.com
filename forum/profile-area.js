import { auth } from './firebase-auth.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const profileArea = document.querySelector('.profile-area');

function updateProfileArea(user) {
    if (user) {
        const photoURL = user.photoURL || 'assets/images/default-profile-photo.jpg';
        const displayName = user.displayName || user.email || 'Kullanýcý';

        profileArea.innerHTML = `
            <div class="profile-trigger" tabindex="0">
                <span class="user-name">${displayName}</span>
                <img src="${photoURL}" class="profile-photo" alt="Profil Fotoðrafý"
                    onerror="this.onerror=null;this.src='assets/images/default-profile-photo.jpg';">
            </div>
            <div class="profile-slider">
                <button class="profile-slider-btn" onclick="window.location.href='/profile.html'">Profil</button>
                <button class="profile-slider-btn logout-btn">Çýkýþ Yap</button>
            </div>
        `;

        // Açma/kapama mantýðý
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

        // Açma
        trigger.addEventListener('click', openSlider);
        trigger.addEventListener('keydown', function(e) {
            if (e.key === "Enter" || e.key === " ") openSlider(e);
        });

        // Dýþarý týklandýðýnda kapansýn
        document.addEventListener('click', closeSlider);
        slider.addEventListener('click', function(e) { e.stopPropagation(); });

        // Çýkýþ
        logoutBtn.addEventListener('click', () => signOut(auth));
    } else {
        profileArea.innerHTML = `<button class="login-btn">Giriþ Yap</button>`;
        document.querySelector('.login-btn').addEventListener('click', () => {
            window.location.href = "../forum/login.html"; // Veya giriþ sayfanýn yolu neyse
        });
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
