import firebase from 'firebase/app'
import "firebase/firestore"

var firebaseConfig = {
    apiKey: "AIzaSyAvX3Yiwha3brN3Uq3GktZ_HNgrKVrP3yM",
    authDomain: "coronavirus-121.firebaseapp.com",
    databaseURL: "https://coronavirus-121.firebaseio.com",
    projectId: "coronavirus-121",
    storageBucket: "coronavirus-121.appspot.com",
    messagingSenderId: "691941912182",
    appId: "1:691941912182:web:47ec19885f9431d20db957",
    measurementId: "G-SN1DYBWK0Q"
  };

firebase.initializeApp(firebaseConfig);
export default firebase