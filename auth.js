let currentUser = null;

auth.onAuthStateChanged(user => {
  if(user) {
    currentUser = user;
    document.getElementById('signInBtn').style.display = 'none';
    document.getElementById('signUpBtn').style.display = 'none';
    document.getElementById('signOutBtn').style.display = 'block';

    // Create Firestore user if new
    db.collection('users').doc(user.uid).get().then(doc => {
      if(!doc.exists) {
        db.collection('users').doc(user.uid).set({
          name: "Anonymous",
          customId: Math.floor(1000000000 + Math.random()*9000000000),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          dailyPostCount: 0,
          lastPostDate: null,
          followers: [],
          following: []
        });
      }
    });
  } else {
    currentUser = null;
    document.getElementById('signInBtn').style.display = 'block';
    document.getElementById('signUpBtn').style.display = 'block';
    document.getElementById('signOutBtn').style.display = 'none';
  }
});

// Anonymous Sign-In
function signInAnonymously() {
  auth.signInAnonymously().catch(err => showToast(err.message));
}

// Email/Password Sign-Up
function signUp(email, password, name, customId, dob) {
  auth.createUserWithEmailAndPassword(email,password)
    .then(userCredential=>{
      const uid = userCredential.user.uid;
      db.collection('users').doc(uid).set({
        email, name, customId, dob,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        dailyPostCount: 0,
        lastPostDate: null,
        followers: [],
        following: []
      });
    })
    .catch(err=>showToast(err.message));
}

// Email/Password Sign-In
function signIn(email,password){
  auth.signInWithEmailAndPassword(email,password)
  .catch(err=>showToast(err.message));
}

// Sign Out
document.getElementById('signOutBtn').addEventListener('click',()=>{
  auth.signOut();
});
