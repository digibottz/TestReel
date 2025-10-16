let lastVisible = null;
let isLoading = false;

// Load Posts
function loadPosts(limit){
  if(isLoading) return;
  isLoading = true; showLoading(true);

  let query = db.collection('posts').orderBy('createdAt','desc').limit(limit);
  if(lastVisible) query = query.startAfter(lastVisible);

  query.get().then(snapshot=>{
    if(!snapshot.empty){
      lastVisible = snapshot.docs[snapshot.docs.length-1];
      snapshot.docs.forEach(doc=>{
        renderPost(doc.data(), doc.id);
      });
    }
    showLoading(false);
    isLoading=false;
  }).catch(err=>{
    showToast(err.message);
    isLoading=false;
    showLoading(false);
  });
}

// Render Post
function renderPost(post, postId){
  const feed = document.getElementById('feed');
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  postDiv.innerHTML = `
    <h3>${post.userId}</h3>
    <p>${post.content}</p>
    <div class="post-actions">
      <button onclick="likePost('${postId}')">❤️ ${post.likes||0}</button>
      <button onclick="openComments('${postId}')">💬 ${post.commentsCount||0}</button>
      <button onclick="repost('${postId}')">🔁 ${post.reposts||0}</button>
    </div>
  `;
  feed.appendChild(postDiv);
}

// Like Post
function likePost(postId){
  db.collection('posts').doc(postId)
    .update({ likes: firebase.firestore.FieldValue.increment(1) });
}

// Repost
function repost(postId){
  db.collection('posts').doc(postId)
    .update({ reposts: firebase.firestore.FieldValue.increment(1) });
}

// Scroll to load next posts
window.addEventListener('scroll',()=>{
  if((window.innerHeight+window.scrollY)>=document.body.offsetHeight-50){
    loadPosts(10);
  }
});

// Add New Post
document.getElementById('addPostBtn').addEventListener('click',()=>{
  const content = prompt('Enter your post:');
  if(!content) return;

  if(!currentUser){
    showToast("Sign in first");
    return;
  }

  // Daily post limit check
  const userRef = db.collection('users').doc(currentUser.uid);
  userRef.get().then(doc=>{
    const data = doc.data();
    const today = new Date().toDateString();
    let dailyCount = data.lastPostDate === today ? data.dailyPostCount : 0;
    if(dailyCount>=5){ // Example limit
      showToast("Daily post limit reached");
      return;
    }
    // Create Post
    db.collection('posts').add({
      userId: currentUser.uid,
      content,
      type: 'Public',
      likes:0, shares:0, commentsCount:0, reposts:0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(()=>{
      userRef.update({
        dailyPostCount: dailyCount+1,
        lastPostDate: today
      });
      showToast("Post Added");
    });
  });
});
