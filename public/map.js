

//let db = firebase.firestore();

let gameSession;

window.onload = function () {

  let markers = []

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
    navigator.geolocation.watchPosition(checkDistance);
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

  function checkDistance(position){

    const places = currentSession.places
    console.log("Locations", places)

    console.log("MArkers", markers)

    for(let place of markers){

         var from = turf.point([position.coords.longitude, position.coords.latitude]);
         var to = turf.point([place.getLngLat().lng, place.getLngLat().lat]);
         var options = {units: 'miles'};

         var distance = turf.distance(from, to, options);

          // 500ft   0.1524
          // 250ft   0.0762
          // 100ft   0.03048

         if(distance > 0.03048){
          console.log(`Sa far away!`,distance)
          place.getElement().classList.add('hidden')
         }else{
           console.log(`Your close`,distance)
           place.getElement().classList.add('remove')
         }
    }
  }

  function createMarkers(places){
    markers = [];

    //test markers
    testMarker = new mapboxgl.Marker()
      .setLngLat([-83.096039, 42.381821])
      .addTo(map);
      testMarker.getElement().addEventListener("click", () => {
        window.location.href = '/newar.html';
      })
      markers.push(testMarker)

    for(let place of places){
      const marker = new mapboxgl.Marker()
      .setLngLat([place.longitude, place.latitude])
      .addTo(map);
      marker.getElement().addEventListener("click", () => {
        window.location.href = '/newar.html';
      })
      markers.push(marker)
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