// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, startAfter } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

onst firebaseConfig = {
  apiKey: "AIzaSyAmB-r-RgOsD9kj7hc0Xz4Pvjcqp2c1KuY",
  authDomain: "textreelsapp.firebaseapp.com",
  projectId: "textreelsapp",
  storageBucket: "textreelsapp.firebasestorage.app",
  messagingSenderId: "659142869313",
  appId: "1:659142869313:web:69c2edebdf391c24aee1c0",
  measurementId: "G-WVWYEJ3SND"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Auto sign-in anonymously
signInAnonymously(auth);

export { db, collection, addDoc, getDocs, query, orderBy, limit, startAfter };
