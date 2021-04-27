/// Auth stuff

// var firebaseConfig = {
//   apiKey: "AIzaSyAjgkU7oRkq8ryphr66PKW5EziHOreT5X4",
//   authDomain: "scarab-club.firebaseapp.com",
//   projectId: "scarab-club",
//   storageBucket: "scarab-club.appspot.com",
//   messagingSenderId: "509020471771",
//   appId: "1:509020471771:web:5ae2b7c82516c5aaa167fe"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

/// Auth stuff

document.addEventListener('DOMContentLoaded', function() {

var ui = new firebaseui.auth.AuthUI(firebase.auth());

let currentUser;

firebase.auth().onAuthStateChanged((firebaseuser) => {
  if (firebaseuser) {
    console.log(firebaseuser);
    currentUser = firebaseuser;
    const startGame = document.getElementById('startGame');
    if(startGame){
      startGame.classList.toggle("hidden")
    }
  } else {
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      //signInSuccessUrl: "https://scarab-club.web.app/"
      signInSuccessUrl: "localhost:5000/"
    });
  }
});
});
/// Database stuff
