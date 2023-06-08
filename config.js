// Import the functions you need from the SDKs you need
import Firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqGezDUVX4nXqxNURjyaGV3A8uIFTuJEg",
  authDomain: "jojos-bizarre-adventure-quiz.firebaseapp.com",
  projectId: "jojos-bizarre-adventure-quiz",
  storageBucket: "jojos-bizarre-adventure-quiz.appspot.com",
  messagingSenderId: "401364374488",
  appId: "1:401364374488:web:8d629a47e6e0caebd818ad"
};

// Initialize Firebase
const app = Firebase.initializeApp(firebaseConfig);

export const db = app.database();