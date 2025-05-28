import { auth, db, storage, storageRef } from '../forum/firebase-init.js';
import { updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Kullanýcý profili yükle
async function loadProfile() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = './login.html';
        return;
    }

    // Profil fotoðrafý
    document.getElementById('profile-avatar').src = '../assets/images/default-profile-photo.jpg';


    // Firestore'dan kullanýcý adý, bio vs
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        document.getElementById('username').value = userSnap.data().username || '';
        document.getElementById('bio').value = userSnap.data().bio || '';
    }

    // Forumlarým
    const q = query(collection(db, 'forums'), where('authorId', '==', user.uid));
    const querySnap = await getDocs(q);
    const forumList = document.getElementById('forum-list');
    forumList.innerHTML = '<strong>Forumlarým</strong>';
    if (querySnap.empty) {
        forumList.innerHTML += `<div class="empty-msg">Henüz forum paylaþýmýnýz yok.</div>`;
    } else {
        querySnap.forEach(docu => {
            const d = docu.data();
            forumList.innerHTML += `<div class="forum-item">
                <a href="./detail.html?id=${docu.id}">${d.title || 'Baþlýksýz'}</a>
                <span style="font-size:.85em;color:#ccc;">(${d.createdAt && d.createdAt.toDate ? new Date(d.createdAt.toDate()).toLocaleDateString() : ''})</span>
            </div>`;
        });
    }
}

// Kullanýcý giriþ yaptýysa profili yükle
auth.onAuthStateChanged(user => {
    if (user) loadProfile();
    else window.location.href = './login.html';
});

// Profil fotoðrafý yükle
    const user = auth.currentUser;
    const file = e.target.files[0];
    if (!user || !file) return;
    const avatarRef = storageRef(storage, `profile_images/${user.uid}.jpg`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);
    document.getElementById('profile-avatar').src = url;
});

// Kullanýcý adý düzenleme
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

// Bio düzenleme
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

// Þifre deðiþtirme (ileride modal açmak için burasý geliþtirilmeli)
window.openChangePassword = function() {
    alert("Þifre deðiþtirme iþlemi burada yapýlacak! (Henüz entegre deðil.)");
};
