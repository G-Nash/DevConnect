function darkLight(){
    if (getComputedStyle(document.documentElement).getPropertyValue("--backgroundColor")!="#e1e1e1"){
        document.documentElement.style.setProperty("--backgroundColor","#e1e1e1")
        document.documentElement.style.setProperty("--textbasic","#000000")
        document.documentElement.style.setProperty("--marginColor","#00000080")
        document.documentElement.style.setProperty("--accentColor","#a9a9a9")
        document.documentElement.style.setProperty("--textaccentColor","#00000080")
    }
    else{
        document.documentElement.style.setProperty("--backgroundColor","#0E1217")
        document.documentElement.style.setProperty("--textbasic","#ffffff")
        document.documentElement.style.setProperty("--marginColor","#d3d3d380")
        document.documentElement.style.setProperty("--accentColor","#1C1F26")
        document.documentElement.style.setProperty("--textaccentColor","#ffffff80")
    }
}


let logout=document.getElementById("navBarLogout")

if(logout){
    logout.addEventListener("click", ()=>{
        location.replace("./index.html")
    })
}


let sideLogout=document.getElementById("sideBarLogOut")

if(sideLogout){
    sideLogout.addEventListener("click",()=>{
        location.replace("./index.html")
    })
}


// Get the modal and new post button elements
const modal = document.getElementById('postModal');
const newPostBtn = document.getElementById('sideBarNewPost');
const closeButton = document.querySelector('.close-button');

newPostBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Also close modal if user clicks outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


// A global array to store posts (in a real app, you might store this in a database)
let posts = [];

// Reference to the form and the feed container
const newPostForm = document.getElementById('newPostForm');
const feedContainer = document.querySelector('.contents');

newPostForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Gather form data
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postDesc').value;
  const imageInput = document.getElementById('postImage');

  // Function to process the image (if any) and then save the post
  const processPost = (imageData) => {
    // Create a JSON object for the post
    const postData = {
      title: title,
      description: description,
      image: imageData, // can be null if no image
      createdAt: new Date().toISOString()
    };

    // Save the post in the posts array (or send to a server)
    posts.push(postData);

    // Optionally, save posts in localStorage for persistence
    localStorage.setItem('posts', JSON.stringify(posts));

    // Update the feed UI with the new post
    addPostToFeed(postData);

    // Close the modal and reset the form
    modal.style.display = 'none';
    newPostForm.reset();
  };

  // Check if an image is selected and process it using FileReader
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      processPost(e.target.result); // e.target.result is the base64 image data
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    // No image selected; pass null for image
    processPost(null);
  }
});



function addPostToFeed(post) {
    // Create a container div for the post
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
  
    // Add post title and description
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
    `;
  
    // If there is an image, create an image element and append it
    if (post.image) {
      const img = document.createElement('img');
      img.src = post.image;
      img.alt = post.title;
      img.style.maxWidth = '100%';
      postDiv.appendChild(img);
    }
  
    // Append the new post to the feed container (contents div)
    feedContainer.appendChild(postDiv);
}
  

document.addEventListener('DOMContentLoaded', () => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      posts = JSON.parse(storedPosts);
      posts.forEach(post => addPostToFeed(post));
    }
  });
  
  