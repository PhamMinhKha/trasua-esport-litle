import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQPgJLDajQnAxvLRBXzOHP0VsFvV3prAo",
    authDomain: "thucan-nuocuong.firebaseapp.com",
    databaseURL: "https://thucan-nuocuong.firebaseio.com",
    projectId: "thucan-nuocuong",
    storageBucket: "gs://thucan-nuocuong.appspot.com",
    messagingSenderId: "75469677612",
    appId: "1:75469677612:web:0af0a69760ccba2c"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase;