// analytics.js
import { db } from './firebase-init.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { auth } from './firebase-auth.js';

/**
 * Kullan�c� giri� yapt�ysa ve bu sayfay� daha �nce ziyaret etmediyse bir defa kay�t atar.
 * @param {string} forumId - ziyaret edilen detay id
 */
export async function logUniqueUserPageVisit(forumId) {
    return new Promise((resolve, reject) => {
        // Kullan�c�y� bekle
        const unsub = auth.onAuthStateChanged(async (user) => {
            unsub(); // dinleyiciyi kald�r
            if (!user) return reject("Kullan�c� yok");

            // Bu user bu forumu daha �nce ziyaret etmi� mi?
            const visitsRef = collection(db, "page_visits");
            const q = query(visitsRef, 
                where("forumId", "==", forumId), 
                where("userId", "==", user.uid)
            );
            const snap = await getDocs(q);

            if (snap.empty) {
                // �lk defa ziyaret, kay�t at
                await addDoc(visitsRef, {
                    forumId: forumId,
                    userId: user.uid,
                    ts: serverTimestamp(),
                    // Opsiyonel olarak daha fazla bilgi ekle (browser, username vs)
                });
                resolve(true);
            } else {
                // Zaten daha �nce kay�t at�lm��, tekrar atma
                resolve(false);
            }
        });
    });
}
