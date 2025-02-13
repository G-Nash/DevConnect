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

let logout = document.getElementById("navBarLogout");

if (logout) {
  logout.addEventListener("click", () => {
    location.replace("./index.html");
  });
}

let sideLogout = document.getElementById("sideBarLogOut");

if (sideLogout) {
  sideLogout.addEventListener("click", () => {
    location.replace("./index.html");
  });
}


// Get the modal and new post button elements
const modal = document.getElementById('postModal');
const newPostBtn = document.getElementById('sideBarNewPost');
const closeButton = document.querySelector('.close-button');

newPostBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
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