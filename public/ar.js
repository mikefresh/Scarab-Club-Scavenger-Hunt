window.onload = () => {
let currentSession;
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
          window.location.href = '/map.html';
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
      console.log("YOU ARE TRYING TO COMPLETE THIS SESSION!", currentSession);
    }
  }
     
       completeClueButton.addEventListener("click", (e) => {
    e.preventDefault();
    answerClue();
  });


     const db = firebase.firestore();


    firebase.auth().onAuthStateChanged((firebaseuser) => {
    if (firebaseuser) {
      getUserSession(firebaseuser);
    }
  });

    

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
            const place = currentSession.places[currentSession.currentPlace]
            pickPlace(place)
            setupDetailsBox(place)
        });
        return userSessions[0];
    }
};

function setupDetailsBox(place){
    const placeText = document.getElementById("placeText")
    const details = document.getElementById("details")
    placeText.innerHTML = place.name
    details.innerHTML = place.description
}

function pickPlace(place){
    console.log("TEHE PLACE", place)

         placeMarker = {
            name: 'Magnemite',
            location: {
                lat: place.latitude,
                lng: place.longitude
            }
        }

            demo = {
            name: 'Magnemite',
            location: {
                lat: 42.381821,
                lng: -83.096039
            }
        }

        renderPlaces(demo)
}


function renderPlaces(placeMarker) {

    let marker = document.getElementById("animated-marker");
    let scene = document.querySelector('a-scene');
        let latitude = placeMarker.location.lat;
        let longitude = placeMarker.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('gltf-model', '/magnemite/scene.gltf');
        model.setAttribute('rotation', '0 180 0');
        model.setAttribute('animation-mixer', '');
        model.setAttribute('scale', '0.5 0.5 0.5');

        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });


        scene.appendChild(model);

        //model.addEventListener("click", () => {alert("you clicked")})


    // AFRAME.registerComponent('clickhandler', {

    // init: function() {
    //     ////const animatedMarker = document.querySelector("#animated-marker");
    //     console.log('Addding')
    //     const aEntity = document.getElementById("animated-model");
    //     aEntity.addEventListener("click", () => {
    //         alert("CLICKED")
    //     })
    // }});
    
}