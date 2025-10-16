const feed = document.getElementById('feed');
let lastVisible = null;
let loadingPosts = false;

async function loadPosts(initial = false) {
  if (loadingPosts) return;
  loadingPosts = true;

  let queryRef = db.collection('posts').orderBy('createdAt', 'desc').limit(5);
  if (!initial && lastVisible) queryRef = queryRef.startAfter(lastVisible);

  const snapshot = await queryRef.get();
  lastVisible = snapshot.docs[snapshot.docs.length - 1];
  renderPosts(snapshot.docs);
  loadingPosts = false;
}

function renderPosts(docs) {
  docs.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <div class="username" data-uid="${data.userId}">@${data.userId.slice(0,6)}</div>
      <div class="text">${data.text}</div>
      <div class="actions">
        <button class="likeBtn" data-id="${doc.id}">❤️ ${data.likeCount || 0}</button>
        <button class="commentBtn" data-id="${doc.id}">💬</button>
        <button class="repostBtn" data-id="${doc.id}">🔁 ${data.repostCount || 0}</button>
      </div>
    `;
    feed.appendChild(div);
  });
}

// Infinite scroll
feed.addEventListener('scroll', () => {
  if (feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 50) {
    loadPosts();
  }
});

// Post creation
document.getElementById('addPostBtn').addEventListener('click', async () => {
  const text = prompt('Enter post text:');
  if (!text) return;
  const user = auth.currentUser;
  if (!user) return showToast('Please sign in first!');
  await db.collection('posts').add({
    text,
    userId: user.uid,
    likeCount: 0,
    repostCount: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  showToast('Posted!');
  feed.innerHTML = '';
  loadPosts(true);
});

// Actions
feed.addEventListener('click', async (e) => {
  const user = auth.currentUser;
  if (!user) return showToast('Sign in to interact!');

  const postId = e.target.dataset.id;
  if (e.target.classList.contains('likeBtn')) {
    const likeRef = db.collection('likes').doc(`${postId}_${user.uid}`);
    const docSnap = await likeRef.get();
    if (docSnap.exists) return showToast('Already liked!');
    await likeRef.set({ postId, userId: user.uid });
    await db.collection('posts').doc(postId).update({ likeCount: firebase.firestore.FieldValue.increment(1) });
    e.target.classList.add('liked');
    e.target.textContent = '❤️ ' + (parseInt(e.target.textContent.split(' ')[1]) + 1);
  }

  if (e.target.classList.contains('commentBtn')) {
    openComments(postId);
  }

  if (e.target.classList.contains('repostBtn')) {
    if (user.isAnonymous) return showToast('Login required to repost!');
    await db.collection('posts').doc(postId).update({ repostCount: firebase.firestore.FieldValue.increment(1) });
    e.target.textContent = '🔁 ' + (parseInt(e.target.textContent.split(' ')[1]) + 1);
  }

  if (e.target.classList.contains('username')) {
    openProfile(e.target.dataset.uid);
  }
});
