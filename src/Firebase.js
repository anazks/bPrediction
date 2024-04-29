import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
const firebaseConfig = {
  apiKey: "AIzaSyAlr-cU_vPwhcyuQ-GYXc98vfLZd-HDVaA",
  authDomain: "esp32tempera.firebaseapp.com",
  databaseURL: "https://esp32tempera-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32tempera",
  storageBucket: "esp32tempera.appspot.com",
  messagingSenderId: "217187863422",
  appId: "1:217187863422:web:2a835dc1d568361b9d012f",
  measurementId: "G-EHBJF4S79T"
};

  firebase.initializeApp(firebaseConfig);
  export const dataRef = firebase.database();
  export default firebase;