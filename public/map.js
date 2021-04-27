

//let db = firebase.firestore();

let gameSession;

window.onload = function () {

  var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
    });
    // Add the control to the map.
    map.addControl(geolocate);
    map.on('load', function() {
    geolocate.trigger();
  });
  
  const db = firebase.firestore();
  // jQuery and everything else is loaded
  $("#clue").modal("show");
  // const toggleClueButton = document.getElementById("toggleClueButton");
  // toggleClueButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   $("#clue").modal("show");
  // });

  firebase.auth().onAuthStateChanged((firebaseuser) => {
    if (firebaseuser) {
      getUserSession(firebaseuser);
    }
  });

  completeClueButton.addEventListener("click", (e) => {
    e.preventDefault();
    answerClue();
  });

  let currentSession;

  function getUserSession(user) {
    let userSessions = [];
    db.collection("sessions")
      .where("userId", "==", user.uid)
      .where("complete", "==", false)
      .onSnapshot((querySnapshot) => {
        userSessions = [];
        querySnapshot.forEach((doc) => {
          userSessions.push({ ...doc.data(), id: doc.id });
        });
        console.log(userSessions);
        currentSession = userSessions[0];
        createMarkers(userSessions[0].places);
        clueText.innerHTML =
          userSessions[0].places[userSessions[0].currentPlace].clue;
      });
    return userSessions[0];
  }

  function createMarkers(places){
    for(let place of places){
      const marker = new mapboxgl.Marker()
      .setLngLat([place.longitude, place.latitude])
      .addTo(map);
      marker.getElement().addEventListener("click", () => {
        window.location.href = '/newar.html';
      })
    }
  }

  function getClue(place) {
    console.log(place.clue);
  }

  function answerClue() {
    currentSession.currentPlace++;
    if (currentSession.currentPlace > 4) {
      completeGame(currentSession);
    } else {
      db.collection("sessions")
        .doc(currentSession.id)
        .update({
          currentPlace: currentSession.currentPlace
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
      console.log("YOU ARE TRYING TO COMPLETE THIS SESSION!", currentSession);
    }
  }
};

function completeGame(currentSession) {
  console.log("Game completed");
  db.collection("sessions").doc(currentSession.id).update({
    endTime: Date.now(),
    complete: true
  });
  receiveBadge();
}

function receiveBadge() {
  console.log("You got a badge!!!!");
}

//startGame();