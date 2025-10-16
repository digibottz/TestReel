const firebaseConfig = {
  apiKey: "AIzaSyAmB-r-RgOsD9kj7hc0Xz4Pvjcqp2c1KuY",
  authDomain: "textreelsapp.firebaseapp.com",
  projectId: "textreelsapp",
  storageBucket: "textreelsapp.firebasestorage.app",
  messagingSenderId: "659142869313",
  appId: "1:659142869313:web:69c2edebdf391c24aee1c0",
  measurementId: "G-WVWYEJ3SND"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
