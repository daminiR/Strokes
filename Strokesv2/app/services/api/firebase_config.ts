// firebase-config.js
import firebase from 'firebase/app';
import 'firebase/messaging';  // Import messaging if you're using FCM

const firebaseConfig = {
  apiKey: "AIzaSyCPT_Z30Cka1-GcpAOUxfvGqqZrEyirR-Y",
  //authDomain: "your-auth-domain",
  projectId: "strokes-dd67a",
  //storageBucket: "your-storage-bucket",
  messagingSenderId: "308692906088",
  appId: "1:308692906088:android:92fe190f3b1e471fad8bdd"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

export {messaging};
export default firebase;

