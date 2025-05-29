import { app, db } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const forumList = document.getElementById("forumList");

// Varsayılan profil fotoğrafı
const DEFAULT_PHOTO = "../assets/images/default-profile-photo.jpg";

async function loadForums() {
    const q = query(collection(db, "forums"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    forumList.innerHTML = '';
    for (const docu of snapshot.docs) {
        const data = docu.data();

        // Kullanıcı verilerini çek (geliştirici notu: authorId forum entry'sinde ZORUNLU olmalı)
        let authorName = "Bilinmeyen";
        let authorPhoto = DEFAULT_PHOTO;
        if (data.authorId) {
            try {
                const userRef = doc(db, "users", data.authorId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    authorName = userSnap.data().username || userSnap.data().email || "Kullanıcı";
                    authorPhoto = userSnap.data().photoURL || DEFAULT_PHOTO;
                }
            } catch (e) {
                // hata olursa varsayılan görsel ve isim
            }
        }

        const row = document.createElement("div");
        row.className = "subforum-row";
        row.innerHTML = `
            <div class="author-col">
                <img src="${authorPhoto}" class="author-avatar" alt="Profil Fotoğrafı" onerror="this.src='${DEFAULT_PHOTO}'">
                <span class="author-username">${authorName}</span>
            </div>
            <div class="subforum-description subforum-column">
                <span class="author-username" style="font-size:.93rem; font-weight:500; color:#FF6600; margin-bottom:2px;">${authorName}</span>
                <h4><a href="detail.html?id=${docu.id}">${data.title}</a></h4>
                <p>${data.content?.slice(0, 300) || ''}...</p>
            </div>
            <div class="subforum-stats subforum-column center">
                <span>1 Yorum | 1 Konu</span>
            </div>
            <div class="subforum-info subforum-column">
                <b><a href="detail.html?id=${docu.id}">Son yorum</a></b><br><small>Bugün</small>
            </div>
        `;
        forumList.appendChild(row);
    }
}
loadForums();
