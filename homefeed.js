const API_URL = "https://devconnectjson-1.onrender.com/api/posts";

/* -------------------------------------------------------
   Dark/Light Mode Toggle
---------------------------------------------------------*/
function darkLight() {
  if (
    getComputedStyle(document.documentElement).getPropertyValue(
      "--backgroundColor"
    ) != "#e1e1e1"
  ) {
    document.documentElement.style.setProperty("--backgroundColor", "#e1e1e1");
    document.documentElement.style.setProperty("--textbasic", "#000000");
    document.documentElement.style.setProperty("--marginColor", "#00000080");
    document.documentElement.style.setProperty("--accentColor", "#a9a9a9");
    document.documentElement.style.setProperty(
      "--textaccentColor",
      "#00000080"
    );
  } else {
    document.documentElement.style.setProperty("--backgroundColor", "#0E1217");
    document.documentElement.style.setProperty("--textbasic", "#ffffff");
    document.documentElement.style.setProperty("--marginColor", "#d3d3d380");
    document.documentElement.style.setProperty("--accentColor", "#1C1F26");
    document.documentElement.style.setProperty(
      "--textaccentColor",
      "#ffffff80"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const postsEndpoint = "https://devconnectjson-1.onrender.com/api/posts"; // Adjust URL as needed

  // Retrieve current user from session storage and update the sidebar
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (currentUser && currentUser.username) {
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) {
      usernameDisplay.textContent = currentUser.username;
    }
  }

  // Logout functionality
  document.getElementById("navBarLogout")?.addEventListener("click", () =>
    location.replace("./index.html")
  );
  document.getElementById("sideBarLogOut")?.addEventListener("click", () =>
    location.replace("./index.html")
  );

  // *** NEW: Profile Overview navigation ***
  document.getElementById("sideBarProfileButton")?.addEventListener("click", () =>
    location.assign("./profile.html")
  );

  // --- NEW: Sidebar Toggle for Mobile ---
  const toggleSidebarButton = document.getElementById("toggleSidebarButton");
  const sidebar = document.querySelector(".sideBar");
  if (toggleSidebarButton && sidebar) {
    toggleSidebarButton.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // --- Modal Handling ---
  const modal = document.getElementById("postModal");
  const newPostBtn = document.getElementById("sideBarNewPost");
  const closeButton = document.querySelector(".close-button");

  newPostBtn.addEventListener("click", () => (modal.style.display = "flex"));
  closeButton.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });

  // --- Search Functionality ---
  const navSearchForm = document.querySelector("#navSearchDiv form");
  navSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchQuery = document
      .getElementById("navSearch")
      .value.trim()
      .toLowerCase();

    fetch(postsEndpoint)
      .then((response) => response.json())
      .then((posts) => {
        const filteredPosts = posts.filter((post) => {
          return (
            post.title.toLowerCase().includes(searchQuery) ||
            post.description.toLowerCase().includes(searchQuery)
          );
        });
        const feedSpace = document.querySelector(".feedSpace");
        feedSpace.innerHTML = "";
        if (filteredPosts.length === 0) {
          const message = document.createElement("p");
          message.textContent = "No posts found.";
          feedSpace.appendChild(message);
        } else {
          filteredPosts.reverse().forEach((post) => renderPost(post));
        }
      })
      .catch((error) => console.error("Error fetching posts:", error));
  });

  // --- Function to Render a Single Post ---
  function renderPost(post, prepend = false) {
    const feedSpace = document.querySelector(".feedSpace");

    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.setAttribute("data-id", post.id);

    // Post Title
    const titleEl = document.createElement("h3");
    titleEl.textContent = post.title;
    postDiv.appendChild(titleEl);

    // Display Post Author if available
    if (post.author) {
      const authorEl = document.createElement("p");
      authorEl.style.fontSize = "0.9rem";
      authorEl.style.fontStyle = "italic";
      authorEl.textContent = `Posted by: ${post.author}`;
      postDiv.appendChild(authorEl);
    }

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
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      // Initialize likedBy if it doesn't exist
      if (!post.likedBy) post.likedBy = [];
      // Check if the current user has already liked this post
      if (currentUser && post.likedBy.includes(currentUser.email)) {
        alert("You have already liked this post.");
        return;
      }
      const updatedLikes = post.likes + 1;
      const updatedLikedBy = [...(post.likedBy || []), currentUser.email];
      fetch(`${postsEndpoint}/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: updatedLikes, likedBy: updatedLikedBy }),
      })
        .then((response) => response.json())
        .then((updatedPost) => {
          post.likes = updatedPost.likes;
          post.likedBy = updatedPost.likedBy;
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
      // Retrieve current user details for the comment
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      const commentAuthor = currentUser
        ? currentUser.username
        : "Anonymous Developer";
      
      const newComment = {
        id: post.comments?.length + 1 || 1,
        author: commentAuthor,
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

    // Delete Button - Only show if current user is the author
    const currentUserForDelete = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUserForDelete && post.author === currentUserForDelete.username) {
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
    }

    postDiv.appendChild(actionsDiv);

    // Add new posts at the top if 'prepend' is true; otherwise, append normally.
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

    // Get the current user details from session storage
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    const title = document.getElementById("postTitle").value;
    const desc = document.getElementById("postDesc").value;
    const imageInput = document.getElementById("postImage");

    // Helper function to create post object including author, email, and initialize likedBy as empty array
    const createPostObject = (imageData) => ({
      title,
      description: desc,
      image: imageData || null,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
      author: currentUser ? currentUser.username : "Anonymous",
      email: currentUser ? currentUser.email : ""
    });

    // If an image is provided, convert it to Base64
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const postObj = createPostObject(event.target.result);
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
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      // No image provided
      const postObj = createPostObject(null);
      fetch(postsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postObj),
      })
        .then((response) => response.json())
        .then((newPost) => {
          renderPost(newPost, true);
          newPostForm.reset();
          modal.style.display = "none";
        })
        .catch((error) => console.error("Error posting new post:", error));
    }
  });
});
