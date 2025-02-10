import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "./firebase.js";

let loginform = document.getElementById("loginform");
let signupform = document.getElementById("signupform");

if(signupform){
    signupform.addEventListener("submit",(e) => {
        e.preventDefault();
      
        let auth = getAuth();
        let email = e.target[0].value;
        let password = e.target[1].value;
        let retypepassword = e.target[2].value;
        if(password===retypepassword){
          createUserWithEmailAndPassword(auth, email, password)
          .then((x) => {
            console.log(x);
            alert("User registered successfully");
            location.assign("./login.html");
          })
          .catch((error) => {
            alert(error.message);
          });
        }
        else{
          alert("Passwords don't match")
        }
      });
}

if(loginform){
    loginform.addEventListener("submit",(e) => {
        e.preventDefault();
      
        let auth = getAuth();
        let email = e.target[0].value;
        let password = e.target[1].value;
      
        signInWithEmailAndPassword(auth, email, password)
          .then((x) => {
              console.log(x.user.accessToken);
            //   alert("logged in successfully");
              location.replace("./homefeed.html")
          })
          .catch((error) => {
            alert(error.message);
          });
      });
}
