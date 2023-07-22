// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCn17xfK5ptTl_Ux76hjvlKl4LGxP5XvkA",
  authDomain: "illegible-speech-recognition.firebaseapp.com",
  projectId: "illegible-speech-recognition",
  storageBucket: "illegible-speech-recognition.appspot.com",
  messagingSenderId: "352603185120",
  appId: "1:352603185120:web:4ef4e3bb39e57f11325585",
  measurementId: "G-XYF83Y83VK"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0){
    app = initializeApp(firebaseConfig);
}
else{
    app = firebase.app();
}

const auth = firebase.auth()
export {auth};

