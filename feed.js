import { db, collection, getDocs, query, orderBy, limit, startAfter } from "./firebase.js";

const reelContainer = document.getElementById("reelContainer");
const loading = document.getElementById("loading");
const addPostBtn = document.getElementById("addPostBtn");

let lastVisible = null;
let loadingPosts = false;

// Load initial posts
loadPosts(true);

async function loadPosts(initial = false) {
  if (loadingPosts) return;
  loadingPosts = true;
  loading.style.display = "block";

  try {
    let q;
    if (initial) {
      q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(3));
    } else {
      q = query(collection(db, "posts"), orderBy("timestamp", "desc"), startAfter(lastVisible), limit(10));
    }

    const snap = await getDocs(q);
    if (!snap.empty) {
      lastVisible = snap.docs[snap.docs.length - 1];
      snap.forEach((doc) => renderPost(doc.data()));
    }
  } catch (err) {
    console.error(err);
  }

  loading.style.display = "none";
  loadingPosts = false;
}

// Render a post
function renderPost(post) {
  const div = document.createElement("div");
  div.classList.add("post");
  div.innerHTML = `
    <div class="post-text">${post.text}</div>
    <div class="actions">
      ❤️ ${post.likes || 0}
      💬 ${post.comments || 0}
      🔁 ${post.reposts || 0}
    </div>
  `;
  reelContainer.appendChild(div);
}

// Infinite scroll
reelContainer.addEventListener("scroll", () => {
  if (reelContainer.scrollTop + reelContainer.clientHeight >= reelContainer.scrollHeight - 100) {
    loadPosts();
  }
});

// Add new post button (for testing)
addPostBtn.addEventListener("click", async () => {
  const text = prompt("Write your text post:");
  if (!text) return;

  const newPost = {
    text,
    timestamp: new Date(),
    likes: 0,
    comments: 0,
    reposts: 0
  };
  await addDoc(collection(db, "posts"), newPost);
  alert("✅ Post added!");
  reelContainer.innerHTML = "";
  lastVisible = null;
  loadPosts(true);
});
