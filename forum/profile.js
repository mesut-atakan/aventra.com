import { auth, db, storage } from '../forum/firebase-init.js';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile, updatePassword } from "firebase/auth";

// Kullan�c�y� �ek
async function loadProfile() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = './login.html';
        return;
    }

    // Profil foto�raf�
    const avatarRef = ref(storage, `profile_images/${user.uid}.jpg`);
    getDownloadURL(avatarRef)
        .then(url => document.getElementById('profile-avatar').src = url)
        .catch(() => document.getElementById('profile-avatar').src = '../assets/images/default-profile-photo.jpg');

    // Firestore'dan kullan�c� ad�, bio vs
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        document.getElementById('username').value = userSnap.data().username || '';
        document.getElementById('bio').value = userSnap.data().bio || '';
    }

    // Forumlar�m
    const q = query(collection(db, 'forums'), where('authorId', '==', user.uid));
    const querySnap = await getDocs(q);
    const forumList = document.getElementById('forum-list');
    forumList.innerHTML = '<strong>Forumlar�m</strong>';
    if (querySnap.empty) {
        forumList.innerHTML += `<div class="empty-msg">Hen�z forum payla��m�n�z yok.</div>`;
    } else {
        querySnap.forEach(doc => {
            const d = doc.data();
            forumList.innerHTML += `<div class="forum-item">
                <a href="./detail.html?id=${doc.id}">${d.title || 'Ba�l�ks�z'}</a> <span style="font-size:.85em;color:#ccc;">(${new Date(d.createdAt?.toDate?.() || Date.now()).toLocaleDateString()})</span>
            </div>`;
        });
    }
}
auth.onAuthStateChanged(loadProfile);

// Profil foto�raf� y�kle
document.getElementById('avatar-upload').addEventListener('change', async (e) => {
    const user = auth.currentUser;
    const file = e.target.files[0];
    if (!user || !file) return;
    const avatarRef = ref(storage, `profile_images/${user.uid}.jpg`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);
    document.getElementById('profile-avatar').src = url;
    // Profil g�ncelle (iste�e ba�l�)
});

// Kullan�c� ad� ve bio d�zenleme
document.getElementById('edit-username').addEventListener('click', async () => {
    const input = document.getElementById('username');
    input.disabled = !input.disabled;
    if (input.disabled) {
        // Kaydet
        const user = auth.currentUser;
        await updateDoc(doc(db, 'users', user.uid), { username: input.value });
        await updateProfile(user, { displayName: input.value });
    }
});
document.getElementById('edit-bio').addEventListener('click', async () => {
    const textarea = document.getElementById('bio');
    textarea.disabled = !textarea.disabled;
    if (textarea.disabled) {
        // Kaydet
        const user = auth.currentUser;
        await updateDoc(doc(db, 'users', user.uid), { bio: textarea.value });
    }
});

// �ifre de�i�tirme (modal a�ma fonksiyonu tan�mlanacak!)
window.openChangePassword = function() {
    // �ifre de�i�tirme popup veya modal� a�
    alert("�ifre de�i�tirme i�lemi burada yap�lacak!");
    // �ifre de�i�tirme i�in Firebase fonksiyonunu burada entegre etmen gerekiyor.
};
