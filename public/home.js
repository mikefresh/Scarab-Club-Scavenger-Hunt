document.addEventListener('DOMContentLoaded', function() {

let currentUser;

firebase.auth().onAuthStateChanged((firebaseuser) => {
  if (firebaseuser) {
    currentUser = firebaseuser
  }
});


let startGameButton = document.getElementById("startGame");

startGameButton.addEventListener("click", () => {
  getPlaces();
});

let db = firebase.firestore();

let gameSession;

function getPlaces() {
  var places = [];
  db.collection("places")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((document) => {
        places.push(document.data());
        //createPlaceMarker(document);
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

async function getAPerson(){
  return db.collection("people").get().then((querySnapshot) => {
  var people = [];
  querySnapshot.forEach((doc) => {
      people.push({ ...doc.data(), id: doc.id });
    });
    console.log(people);
    return people[0]
  });
}

async function getFivePlaces(places) {
  //console.log(places[Math.floor(Math.random() * places.length)]);
  var fivePlaces = [];
  while (fivePlaces.length < 5) {
    let place = places[Math.floor(Math.random() * places.length)];

    if (fivePlaces.includes(place)) {
      console.log("we found a duplicate");
    } else {
      const person = await getAPerson()
      place.person = person;
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
    userId: currentUser.uid,
    complete: false,
    startTime: Date.now(),
    endTime: null,
    currentPlace: 0
  };

  gameSession.places = places;
  console.log(gameSession);
  saveSession(gameSession);
}

function saveSession(session) {
  db.collection("sessions").add(session);

  window.location.replace("/map.html");
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
});