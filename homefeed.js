document.addEventListener("DOMContentLoaded", () => {
  const postsEndpoint = "http://localhost:3000/posts"; // Adjust URL as needed

  // --- Dark/Light Mode Toggle with Local Storage ---
  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.style.setProperty("--backgroundColor", "#e1e1e1");
      document.documentElement.style.setProperty("--textbasic", "#000000");
      document.documentElement.style.setProperty("--marginColor", "#00000080");
      document.documentElement.style.setProperty("--accentColor", "#a9a9a9");
      document.documentElement.style.setProperty("--textaccentColor", "#00000080");
    } else {
      document.documentElement.style.setProperty("--backgroundColor", "#0E1217");
      document.documentElement.style.setProperty("--textbasic", "#ffffff");
      document.documentElement.style.setProperty("--marginColor", "#d3d3d380");
      document.documentElement.style.setProperty("--accentColor", "#1C1F26");
      document.documentElement.style.setProperty("--textaccentColor", "#ffffff80");
    }
  }

  function darkLight() {
    const currentTheme = localStorage.getItem("theme") === "light" ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
  }

  applyTheme(localStorage.getItem("theme") || "dark");

  // Logout functionality
  document.getElementById("navBarLogout")?.addEventListener("click", () => location.replace("./index.html"));
  document.getElementById("sideBarLogOut")?.addEventListener("click", () => location.replace("./index.html"));

  // --- Modal Handling ---
  const modal = document.getElementById("postModal");
  const newPostBtn = document.getElementById("sideBarNewPost");
  const closeButton = document.querySelector(".close-button");

  newPostBtn.addEventListener("click", () => (modal.style.display = "flex"));
  closeButton.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });

  // --- Function to Render a Single Post at the Top ---
  function renderPost(post, prepend = false) {
    const feedSpace = document.querySelector(".feedSpace");

    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.setAttribute("data-id", post.id);

    // Post Title
    const titleEl = document.createElement("h3");
    titleEl.textContent = post.title;
    postDiv.appendChild(titleEl);

    // Post Description
    const descEl = document.createElement("p");
    descEl.textContent = post.description;
    postDiv.appendChild(descEl);

    // Optional Image
    if (post.image) {
      const imageEl = document.createElement("img");
      imageEl.src = post.image;
      postDiv.appendChild(imageEl);
    }

    // Actions Container
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "post-actions";

    // Like Button
    const likeButton = document.createElement("button");
    likeButton.textContent = `Like (${post.likes})`;
    likeButton.className = "like-button";
    actionsDiv.appendChild(likeButton);

    likeButton.addEventListener("click", () => {
      const updatedLikes = post.likes + 1;
      fetch(`${postsEndpoint}/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: updatedLikes }),
      })
        .then((response) => response.json())
        .then((updatedPost) => {
          post.likes = updatedPost.likes;
          likeButton.textContent = `Like (${updatedPost.likes})`;
        })
        .catch((error) => console.error("Error updating likes:", error));
    });

    // Comment Section
    const commentContainer = document.createElement("div");
    commentContainer.className = "comment-container";

    // Display Comments
    const commentList = document.createElement("ul");
    commentList.className = "comment-list";
    if (post.comments?.length) {
      post.comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.textContent = `${comment.author}: ${comment.text}`;
        commentList.appendChild(commentItem);
      });
    }
    commentContainer.appendChild(commentList);

    // Comment Form
    const commentForm = document.createElement("form");
    commentForm.className = "comment-form";

    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment...";
    commentInput.required = true;
    commentForm.appendChild(commentInput);

    const commentSubmit = document.createElement("button");
    commentSubmit.type = "submit";
    commentSubmit.textContent = "Comment";
    commentForm.appendChild(commentSubmit);

    // Handle Comment Submission
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newComment = {
        id: post.comments?.length + 1 || 1,
        author: "Anonymous Developer",
        text: commentInput.value,
      };

      const updatedComments = [...(post.comments || []), newComment];

      fetch(`${postsEndpoint}/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments }),
      })
        .then((response) => response.json())
        .then((updatedPost) => {
          post.comments = updatedPost.comments;
          const commentItem = document.createElement("li");
          commentItem.textContent = `${newComment.author}: ${newComment.text}`;
          commentList.appendChild(commentItem);
          commentInput.value = "";
        })
        .catch((error) => console.error("Error adding comment:", error));
    });

    commentContainer.appendChild(commentForm);
    actionsDiv.appendChild(commentContainer);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    actionsDiv.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this post?")) {
        fetch(`${postsEndpoint}/${post.id}`, { method: "DELETE" })
          .then(() => postDiv.remove())
          .catch((error) => console.error("Error deleting post:", error));
      }
    });

    postDiv.appendChild(actionsDiv);
    
    // Add new posts at the top
    if (prepend) {
      feedSpace.prepend(postDiv);
    } else {
      feedSpace.appendChild(postDiv);
    }
  }

  // Fetch and Render All Posts
  function fetchAndRenderPosts() {
    fetch(postsEndpoint)
      .then((response) => response.json())
      .then((posts) => {
        const feedSpace = document.querySelector(".feedSpace");
        feedSpace.innerHTML = "";
        posts.reverse().forEach((post) => renderPost(post)); // Reverse to ensure newest appears first
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }

  fetchAndRenderPosts();

  // --- New Post Submission ---
  const newPostForm = document.getElementById("newPostForm");

  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("postTitle").value;
    const desc = document.getElementById("postDesc").value;
    const imageInput = document.getElementById("postImage");

    const postObj = {
      title,
      description: desc,
      image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : null,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    fetch(postsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postObj),
    })
      .then((response) => response.json())
      .then((newPost) => {
        renderPost(newPost, true); // New posts appear at the top
        newPostForm.reset();
        modal.style.display = "none"; // Close modal
      })
      .catch((error) => console.error("Error posting new post:", error));
  });
});
