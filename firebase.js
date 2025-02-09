
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js'



const firebaseConfig = {
  apiKey: "AIzaSyC8vORJHCG6b7cZlz03WFQvs4LtrKj9C9U",
  authDomain: "devconnect-1b3fa.firebaseapp.com",
  projectId: "devconnect-1b3fa",
  storageBucket: "devconnect-1b3fa.firebasestorage.app",
  messagingSenderId: "571904422946",
  appId: "1:571904422946:web:dfd12a8f0a6f5c6b6f467b",
  measurementId: "G-YZT8BXWTTY",
};



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export{
    getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword
}