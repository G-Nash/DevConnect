
import { getAuth, sendPasswordResetEmail } from "./firebase.js";
const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const auth = getAuth();
    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Please check your inbox.");
        location.assign("./login.html")
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error.message);
        alert(error.message);
      });
  });
}
