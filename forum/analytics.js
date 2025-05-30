// analytics.js
import { db } from './firebase-init.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { auth } from './firebase-auth.js';

/**
 * Kullanýcý giriþ yaptýysa ve bu sayfayý daha önce ziyaret etmediyse bir defa kayýt atar.
 * @param {string} forumId - ziyaret edilen detay id
 */
export async function logUniqueUserPageVisit(forumId) {
    return new Promise((resolve, reject) => {
        // Kullanýcýyý bekle
        const unsub = auth.onAuthStateChanged(async (user) => {
            unsub(); // dinleyiciyi kaldýr
            if (!user) return reject("Kullanýcý yok");

            // Bu user bu forumu daha önce ziyaret etmiþ mi?
            const visitsRef = collection(db, "page_visits");
            const q = query(visitsRef, 
                where("forumId", "==", forumId), 
                where("userId", "==", user.uid)
            );
            const snap = await getDocs(q);

            if (snap.empty) {
                // Ýlk defa ziyaret, kayýt at
                await addDoc(visitsRef, {
                    forumId: forumId,
                    userId: user.uid,
                    ts: serverTimestamp(),
                    // Opsiyonel olarak daha fazla bilgi ekle (browser, username vs)
                });
                resolve(true);
            } else {
                // Zaten daha önce kayýt atýlmýþ, tekrar atma
                resolve(false);
            }
        });
    });
}
