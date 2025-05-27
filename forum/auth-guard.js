import { app } from './firebase-init.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
export function requireAuth(redirectUrl = "login.html") {
    const auth = getAuth(app);
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = redirectUrl;
        }
    });
}
