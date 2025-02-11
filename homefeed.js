/* -------------------------------------------------------
   Dark/Light Mode Toggle
---------------------------------------------------------*/
function darkLight() {
    const rootStyles = document.documentElement.style;
    const currentBackground = getComputedStyle(document.documentElement)
      .getPropertyValue("--backgroundColor")
      .trim();
    
    if (currentBackground !== "#e1e1e1") {
      rootStyles.setProperty("--backgroundColor", "#e1e1e1");
      rootStyles.setProperty("--textbasic", "#000000");
      rootStyles.setProperty("--marginColor", "#00000080");
      rootStyles.setProperty("--accentColor", "#a9a9a9");
      rootStyles.setProperty("--textaccentColor", "#00000080");
    } else {
      rootStyles.setProperty("--backgroundColor", "#0E1217");
      rootStyles.setProperty("--textbasic", "#ffffff");
      rootStyles.setProperty("--marginColor", "#d3d3d380");
      rootStyles.setProperty("--accentColor", "#1C1F26");
      rootStyles.setProperty("--textaccentColor", "#ffffff80");
    }
  }
  
  /* -------------------------------------------------------
     Logout Button Functionality
  ---------------------------------------------------------*/
  const logoutButton = document.getElementById("navBarLogout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      location.replace("./index.html");
    });
  }
  
  const sideLogout = document.getElementById("sideBarLogOut");
  if (sideLogout) {
    sideLogout.addEventListener("click", () => {
      location.replace("./index.html");
    });
  }
  
  /* -------------------------------------------------------
     Modal Functionality for New Post
  ---------------------------------------------------------*/
  const modal = document.getElementById("postModal");
  const newPostBtn = document.getElementById("sideBarNewPost");
  const closeButton = document.querySelector(".close-button");
  
  newPostBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });
  
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  // Close modal if user clicks outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  
  /* -------------------------------------------------------
     New Post Submission & Feed Update
  ---------------------------------------------------------*/
  // Global array to store posts (in a real app, this might come from a backend)
  let posts = [];
  
  // DOM references
  const newPostForm = document.getElementById("newPostForm");
  const feedContainer = document.querySelector(".contents");
  
  newPostForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Gather form data
    const title = document.getElementById("postTitle").value;
    const description = document.getElementById("postDesc").value;
    const imageInput = document.getElementById("postImage");
  
    // Process post data (including image, likes, comments, and a unique id)
    const processPost = (imageData) => {
      const postData = {
        id: Date.now(), // simple unique id
        title,
        description,
        image: imageData || null,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
  
      posts.push(postData);
      localStorage.setItem("posts", JSON.stringify(posts));
      addPostToFeed(postData);
      newPostForm.reset();
      modal.style.display = "none";
    };
  
    // If an image is selected, convert it to base64; otherwise, process without image
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        processPost(e.target.result);
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      processPost(null);
    }
  });
  
  /* -------------------------------------------------------
     Helper: Update Post in Storage
  ---------------------------------------------------------*/
  function updatePostInStorage(updatedPost) {
    const index = posts.findIndex((p) => p.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = updatedPost;
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }
  
  /* -------------------------------------------------------
     Add Post to Feed (with Like, Comment, and Delete)
  ---------------------------------------------------------*/
  function addPostToFeed(post) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.setAttribute("data-id", post.id);
  
    // Build inner HTML structure for the post
    let postHtml = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
    `;
    if (post.image) {
      postHtml += `<img src="${post.image}" alt="${post.title}" style="max-width:100%;" />`;
    }
    postHtml += `
      <div class="post-controls">
        <button class="like-btn">Like (<span class="like-count">${post.likes}</span>)</button>
        <button class="comment-btn">Comment</button>
        <button class="delete-btn">Delete</button>
      </div>
      <div class="comment-section" style="display:none;">
        <input type="text" class="comment-input" placeholder="Write a comment..." />
        <button class="submit-comment-btn">Add Comment</button>
        <ul class="comment-list"></ul>
      </div>
    `;
    postDiv.innerHTML = postHtml;
    feedContainer.appendChild(postDiv);
  
    /* --- Like Button Functionality --- */
    const likeBtn = postDiv.querySelector(".like-btn");
    const likeCountSpan = postDiv.querySelector(".like-count");
    likeBtn.addEventListener("click", () => {
      post.likes += 1;
      likeCountSpan.textContent = post.likes;
      updatePostInStorage(post);
    });
  
    /* --- Comment Button Functionality (Toggle Comment Section) --- */
    const commentBtn = postDiv.querySelector(".comment-btn");
    const commentSection = postDiv.querySelector(".comment-section");
    commentBtn.addEventListener("click", () => {
      commentSection.style.display =
        commentSection.style.display === "none" ? "block" : "none";
    });
  
    /* --- Submit Comment Functionality --- */
    const submitCommentBtn = postDiv.querySelector(".submit-comment-btn");
    const commentInput = postDiv.querySelector(".comment-input");
    const commentList = postDiv.querySelector(".comment-list");
  
    submitCommentBtn.addEventListener("click", () => {
      const commentText = commentInput.value.trim();
      if (commentText !== "") {
        // Add the comment to the post object and update UI
        post.comments.push(commentText);
        const li = document.createElement("li");
        li.textContent = commentText;
        commentList.appendChild(li);
        commentInput.value = "";
        updatePostInStorage(post);
      }
    });
  
    /* --- Delete Button Functionality --- */
    const deleteBtn = postDiv.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      posts = posts.filter((p) => p.id !== post.id);
      localStorage.setItem("posts", JSON.stringify(posts));
      feedContainer.removeChild(postDiv);
    });
  
    /* --- Render Existing Comments, if any --- */
    post.comments.forEach((comment) => {
      const li = document.createElement("li");
      li.textContent = comment;
      commentList.appendChild(li);
    });
  }
  
  /* -------------------------------------------------------
     Load Stored Posts on Page Load
  ---------------------------------------------------------*/
  document.addEventListener("DOMContentLoaded", () => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      posts = JSON.parse(storedPosts);
      posts.forEach((post) => addPostToFeed(post));
    }
  });
  