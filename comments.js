let currentPostId = null;
let lastCommentVisible = null;

// Open Comment Modal
function openComments(postId){
  currentPostId = postId;
  lastCommentVisible = null;
  const modal = document.getElementById('commentModal');
  modal.style.display='flex';
  document.getElementById('commentsContainer').innerHTML='';
  loadComments(10);
}

// Close Comment Modal
document.getElementById('closeCommentModal').addEventListener('click',()=>{
  document.getElementById('commentModal').style.display='none';
});

// Load Comments
function loadComments(limit){
  if(!currentPostId) return;
  let query = db.collection('comments').where('postId','==',currentPostId)
    .orderBy('createdAt','desc').limit(limit);
  if(lastCommentVisible) query = query.startAfter(lastCommentVisible);

  query.get().then(snapshot=>{
    if(!snapshot.empty){
      lastCommentVisible = snapshot.docs[snapshot.docs.length-1];
      snapshot.docs.forEach(doc=>{
        renderComment(doc.data(), doc.id);
      });
    }
  });
}

// Render Comment
function renderComment(comment, commentId){
  const container = document.getElementById('commentsContainer');
  const div = document.createElement('div');
  div.className='comment';
  div.innerHTML = `
    <b>${comment.userId}</b> : ${comment.content}
    <button onclick="likeComment('${commentId}')">❤️ ${comment.likes||0}</button>
  `;
  container.appendChild(div);
}

// Like Comment
function likeComment(commentId){
  db.collection('comments').doc(commentId)
    .update({ likes: firebase.firestore.FieldValue.increment(1) });
}

// Submit New Comment
document.getElementById('submitComment').addEventListener('click',()=>{
  const content = document.getElementById('newComment').value;
  if(!content) return;

  db.collection('comments').add({
    postId: currentPostId,
    userId: currentUser.uid,
    content,
    likes:0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    document.getElementById('newComment').value='';
    loadComments(10);
    // Increment comment count in post
    db.collection('posts').doc(currentPostId)
      .update({ commentsCount: firebase.firestore.FieldValue.increment(1) });
  });
});
