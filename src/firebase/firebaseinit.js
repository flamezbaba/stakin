import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyBozowMHHJhESo8I7QP5PpB4ek_NxEiwbM",

  authDomain: "stakin-52014.firebaseapp.com",

  projectId: "stakin-52014",

  storageBucket: "stakin-52014.appspot.com",

  messagingSenderId: "312210230005",

  appId: "1:312210230005:web:1540d51aefe4a072b053bc",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();
