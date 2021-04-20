/// Auth stuff

var firebaseConfig = {
  apiKey: "AIzaSyAjgkU7oRkq8ryphr66PKW5EziHOreT5X4",
  authDomain: "scarab-club.firebaseapp.com",
  projectId: "scarab-club",
  storageBucket: "scarab-club.appspot.com",
  messagingSenderId: "509020471771",
  appId: "1:509020471771:web:5ae2b7c82516c5aaa167fe"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/// Auth stuff

var ui = new firebaseui.auth.AuthUI(firebase.auth());

firebase.auth().onAuthStateChanged((firebaseuser) => {
  if (firebaseuser) {
    console.log(firebaseuser);
    btnLogout.addEventListener("click", logout);
    btnLogout.classList.remove("hide");
  } else {
    btnLogout.classList.add("hide");
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: "https://fgb9m.csb.app/"
    });
  }
});

function logout() {
  firebase.auth().signOut();
}

/// Database stuff

let db = firebase.firestore();

let gameSession;

function getPlaces() {
  var places = [];
  db.collection("places")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((document) => {
        places.push(document.data());
        createPlaceMarker(document);
        //console.log(document.data().name);
      });
      getFivePlaces(places);
    });
}

function createPlaceMarker(document) {
  var popup = new mapboxgl.Popup().setText(document.data().name).addTo(map);

  var marker = new mapboxgl.Marker()
    .setLngLat([document.data().longitude, document.data().latitude])
    .addTo(map)
    .setPopup(popup);
}

function getFivePlaces(places) {
  //console.log(places[Math.floor(Math.random() * places.length)]);
  var fivePlaces = [];
  while (fivePlaces.length < 5) {
    let place = places[Math.floor(Math.random() * places.length)];

    if (fivePlaces.includes(place)) {
      console.log("we found a duplicate");
    } else {
      fivePlaces.push(place);
    }
  }
  console.log(fivePlaces);
  createSession(fivePlaces);
  getClue(fivePlaces[0]);
}

function getClue(place) {
  console.log(place.clue);
}

function createSession(places) {
  gameSession = {
    places: [],
    userId: 1234,
    complete: false,
    startTime: Date.now(),
    endTime: null,
    currentPlace: 0
  };

  gameSession.places = places;
  console.log(gameSession);
}

function startGame() {
  getPlaces();
}

function answerClue() {
  gameSession.currentPlace++;
  if (gameSession.currentPlace > 4) {
    completeGame();
  } else {
    getClue(gameSession.places[gameSession.currentPlace]);
  }
}

function completeGame() {
  console.log("Game completed");
  gameSession.endTime = Date.now();
  gameSession.complete = true;
  receiveBadge();
}

function receiveBadge() {
  console.log("You got a badge!!!!");
}

startGame();
