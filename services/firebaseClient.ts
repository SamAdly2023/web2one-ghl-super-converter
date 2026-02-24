import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase client app (idempotent)
try {
    initializeApp(firebaseConfig);
} catch (e) {
    // Ignore re-initialization errors
}

const auth = getAuth();
const provider = new GoogleAuthProvider();

export async function signInWithGooglePopup() {
    const result = await signInWithPopup(auth, provider);
    return result.user;
}

export async function signOut() {
    return fbSignOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
    return onAuthStateChanged(auth, cb);
}

export async function getIdToken(user?: User) {
    if (!user) return null;
    return user.getIdToken();
}

export default { signInWithGooglePopup, signOut, onAuthChange, getIdToken };
