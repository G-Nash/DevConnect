import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "./firebase.js";

const auth = getAuth();
let loginform = document.getElementById("loginform");
let signupform = document.getElementById("signupform");

const usersEndpoint = "https://devconnectjson.onrender.com/api/users"; // Adjust based on your JSON server

// --- Signup Logic ---
if (signupform) {
  signupform.addEventListener("submit", (e) => {
    e.preventDefault();

    let username = e.target[0].value.trim(); // Username
    let email = e.target[1].value.trim(); // Email
    let password = e.target[2].value; // Password
    let retypepassword = e.target[3].value; // Retype Password

    if (!username || !email || !password || !retypepassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== retypepassword) {
      alert("Passwords don't match.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        console.log("User registered:", user);

        // Save user details to JSON server
        fetch(usersEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.uid, // Use Firebase UID as a unique identifier
            username: username,
            email: email,
          }),
        })
          .then((res) => res.json())
          .then(() => {
            alert("User registered successfully");
            location.assign("./login.html"); // Redirect to login page
          })
          .catch((error) => console.error("Error saving user:", error));
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

// --- Login Logic ---
if (loginform) {
  loginform.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = e.target[0].value.trim();
    let password = e.target[1].value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        console.log("User logged in:", user);

        // Fetch user details from JSON server and store in session storage
        fetch(`${usersEndpoint}?id=${user.uid}`)
          .then((res) => res.json())
          .then((userData) => {
            if (userData.length > 0) {
              sessionStorage.setItem("currentUser", JSON.stringify(userData[0])); // Store user details
              location.replace("./homefeed.html"); // Redirect to feed
            } else {
              alert("User data not found. Please sign up again.");
            }
          })
          .catch((error) => console.error("Error fetching user data:", error));
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}


// --- Guest Mode Logic ---
let guestButton = document.getElementById("guestButton");
if (guestButton) {
  guestButton.addEventListener("click", () => {
    // Create a guest user object
    const guestUser = {
      id: "guest", // Optional: a static id for guest mode
      username: "Guest",
      email: "guest@example.com", // Or you can leave it as an empty string if preferred
    };
    // Store the guest user details in session storage
    sessionStorage.setItem("currentUser", JSON.stringify(guestUser));
    // Redirect to the home feed
    location.replace("./homefeed.html");
  });
}