window.addEventListener('load',()=>{
  // Load first 3 posts
  loadPosts(3);

  // Anonymous login by default
  if(!auth.currentUser){
    signInAnonymously();
  }

  // Check internet
  if(!navigator.onLine){
    showToast("No Internet Connection");
  }

  window.addEventListener('online', ()=>showToast("Back Online"));
  window.addEventListener('offline', ()=>showToast("Offline"));
});
