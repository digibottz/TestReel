function viewProfile(uid){
  db.collection('users').doc(uid).get().then(doc=>{
    const data = doc.data();
    alert(`Name: ${data.name}\nID: ${data.customId}\nFollowers: ${data.followers.length}\nFollowing: ${data.following.length}\nDescription: ${data.description||''}`);
  });
}

// Follow/Unfollow
function toggleFollow(uid){
  const userRef = db.collection('users').doc(currentUser.uid);
  userRef.get().then(doc=>{
    const following = doc.data().following || [];
    if(following.includes(uid)){
      userRef.update({ following: firebase.firestore.FieldValue.arrayRemove(uid) });
      db.collection('users').doc(uid).update({ followers: firebase.firestore.FieldValue.arrayRemove(currentUser.uid) });
    } else {
      userRef.update({ following: firebase.firestore.FieldValue.arrayUnion(uid) });
      db.collection('users').doc(uid).update({ followers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid) });
    }
  });
}
