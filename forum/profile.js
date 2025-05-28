import { auth, db, storage, storageRef } from '../forum/firebase-init.js';
import { updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Kullan�c� profili y�kle
async function loadProfile() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = './login.html';
        return;
    }

    // Profil foto�raf�
    document.getElementById('profile-avatar').src = '../assets/images/default-profile-photo.jpg';


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
        querySnap.forEach(docu => {
            const d = docu.data();
            forumList.innerHTML += `<div class="forum-item">
                <a href="./detail.html?id=${docu.id}">${d.title || 'Ba�l�ks�z'}</a>
                <span style="font-size:.85em;color:#ccc;">(${d.createdAt && d.createdAt.toDate ? new Date(d.createdAt.toDate()).toLocaleDateString() : ''})</span>
            </div>`;
        });
    }
}

// Kullan�c� giri� yapt�ysa profili y�kle
auth.onAuthStateChanged(user => {
    if (user) loadProfile();
    else window.location.href = './login.html';
});

// Profil foto�raf� y�kle
    const user = auth.currentUser;
    const file = e.target.files[0];
    if (!user || !file) return;
    const avatarRef = storageRef(storage, `profile_images/${user.uid}.jpg`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);
    document.getElementById('profile-avatar').src = url;
});

// Kullan�c� ad� d�zenleme
document.getElementById('edit-username').addEventListener('click', async () => {
    const input = document.getElementById('username');
    input.disabled = !input.disabled;
    if (input.disabled) {
        // Kaydet
        const user = auth.currentUser;
        await updateDoc(doc(db, 'users', user.uid), { username: input.value });
        await updateProfile(user, { displayName: input.value });
    } else {
        input.focus();
    }
});

// Bio d�zenleme
document.getElementById('edit-bio').addEventListener('click', async () => {
    const textarea = document.getElementById('bio');
    textarea.disabled = !textarea.disabled;
    if (textarea.disabled) {
        // Kaydet
        const user = auth.currentUser;
        await updateDoc(doc(db, 'users', user.uid), { bio: textarea.value });
    } else {
        textarea.focus();
    }
});

// �ifre de�i�tirme (ileride modal a�mak i�in buras� geli�tirilmeli)
window.openChangePassword = function() {
    alert("�ifre de�i�tirme i�lemi burada yap�lacak! (Hen�z entegre de�il.)");
};
