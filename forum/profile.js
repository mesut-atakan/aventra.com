import { auth, db, storage } from '../forum/firebase-init.js';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile, updatePassword } from "firebase/auth";

// Kullanýcýyý çek
async function loadProfile() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = './login.html';
        return;
    }

    // Profil fotoðrafý
    const avatarRef = ref(storage, `profile_images/${user.uid}.jpg`);
    getDownloadURL(avatarRef)
        .then(url => document.getElementById('profile-avatar').src = url)
        .catch(() => document.getElementById('profile-avatar').src = '../assets/images/default-profile-photo.jpg');

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
        querySnap.forEach(doc => {
            const d = doc.data();
            forumList.innerHTML += `<div class="forum-item">
                <a href="./detail.html?id=${doc.id}">${d.title || 'Baþlýksýz'}</a> <span style="font-size:.85em;color:#ccc;">(${new Date(d.createdAt?.toDate?.() || Date.now()).toLocaleDateString()})</span>
            </div>`;
        });
    }
}
auth.onAuthStateChanged(loadProfile);

// Profil fotoðrafý yükle
document.getElementById('avatar-upload').addEventListener('change', async (e) => {
    const user = auth.currentUser;
    const file = e.target.files[0];
    if (!user || !file) return;
    const avatarRef = ref(storage, `profile_images/${user.uid}.jpg`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);
    document.getElementById('profile-avatar').src = url;
    // Profil güncelle (isteðe baðlý)
});

// Kullanýcý adý ve bio düzenleme
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

// Þifre deðiþtirme (modal açma fonksiyonu tanýmlanacak!)
window.openChangePassword = function() {
    // Þifre deðiþtirme popup veya modalý aç
    alert("Þifre deðiþtirme iþlemi burada yapýlacak!");
    // Þifre deðiþtirme için Firebase fonksiyonunu burada entegre etmen gerekiyor.
};
