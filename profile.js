// profile.js

document.addEventListener("DOMContentLoaded", () => {
    const usersEndpoint = "https://devconnectjson.onrender.com/api/users";
    const postsEndpoint = "https://devconnectjson.onrender.com/api/posts";
    
    // Get current user from session storage
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) {
      // Redirect to login if no user found
      location.replace("./login.html");
      return;
    }

    document.getElementById("navTitle")?.addEventListener("click", () => {
        location.replace("./homefeed.html");
      });
    
    const usernameInput = document.getElementById("usernameInput");
    const saveUsernameButton = document.getElementById("saveUsernameButton");
    const postsContainer = document.getElementById("postsContainer");
    const commentsContainer = document.getElementById("commentsContainer");
    
    // Pre-fill the username input with current username
    usernameInput.value = currentUser.username;
    
    // Function to fetch and display user's posts and comments
    function fetchAndRenderProfileContent() {
      fetch(postsEndpoint)
        .then(response => response.json())
        .then(posts => {
          // Clear containers
          postsContainer.innerHTML = "";
          commentsContainer.innerHTML = "";
          
          // Filter posts authored by the current user
          const userPosts = posts.filter(post => post.author === currentUser.username);
          userPosts.forEach(post => {
            const postItem = document.createElement("div");
            postItem.className = "post-item";
            postItem.innerHTML = `<h3>${post.title}</h3>
                                  <p>${post.description}</p>`;
            postsContainer.appendChild(postItem);
          });
          
          // Display comments made by the current user (from any post)
          posts.forEach(post => {
            if (post.comments && Array.isArray(post.comments)) {
              post.comments.forEach(comment => {
                if (comment.author === currentUser.username) {
                  const commentItem = document.createElement("div");
                  commentItem.className = "comment-item";
                  commentItem.innerHTML = `<strong>Post:</strong> ${post.title}<br>
                                           <strong>Comment:</strong> ${comment.text}`;
                  commentsContainer.appendChild(commentItem);
                }
              });
            }
          });
        })
        .catch(error => console.error("Error fetching posts:", error));
    }
    
    // Initially fetch and render profile content
    fetchAndRenderProfileContent();
    
    // Save username update
    saveUsernameButton.addEventListener("click", () => {
      const newUsername = usernameInput.value.trim();
      if (!newUsername) {
        alert("Username cannot be empty.");
        return;
      }
      if (newUsername === currentUser.username) {
        alert("No changes made.");
        return;
      }
      
      const oldUsername = currentUser.username;
      // Update the user record on the JSON server
      fetch(`${usersEndpoint}/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername })
      })
      .then(response => response.json())
      .then(updatedUser => {
        // Update current user in session storage
        currentUser.username = newUsername;
        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        // Update posts and comments on the server that belong to the old username
        fetch(postsEndpoint)
          .then(response => response.json())
          .then(posts => {
            const updatePromises = [];
            posts.forEach(post => {
              let updated = false;
              const updatedPost = { ...post };
              // If the post author matches old username, update it
              if (updatedPost.author === oldUsername) {
                updatedPost.author = newUsername;
                updated = true;
              }
              // Update comments belonging to the user
              if (updatedPost.comments && Array.isArray(updatedPost.comments)) {
                const newComments = updatedPost.comments.map(comment => {
                  if (comment.author === oldUsername) {
                    return { ...comment, author: newUsername };
                  }
                  return comment;
                });
                // Check if any change occurred
                if (JSON.stringify(updatedPost.comments) !== JSON.stringify(newComments)) {
                  updatedPost.comments = newComments;
                  updated = true;
                }
              }
              if (updated) {
                updatePromises.push(
                  fetch(`${postsEndpoint}/${post.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      author: updatedPost.author,
                      comments: updatedPost.comments
                    })
                  }).then(res => res.json())
                );
              }
            });
            return Promise.all(updatePromises);
          })
          .then(() => {
            alert("Username updated successfully.");
            fetchAndRenderProfileContent();
          })
          .catch(error => console.error("Error updating posts/comments:", error));
      })
      .catch(error => console.error("Error updating username:", error));
    });
  });
  