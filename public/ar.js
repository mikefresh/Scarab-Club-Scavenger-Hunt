window.onload = () => {
     
     


     const db = firebase.firestore();


    firebase.auth().onAuthStateChanged((firebaseuser) => {
    if (firebaseuser) {
      getUserSession(firebaseuser);
    }
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
            const place = currentSession.places[currentSession.currentPlace]
            pickPlace(place)
        });
        return userSessions[0];
    }
};

function pickPlace(place){
    console.log("TEHE PLACE", place)

         placeMarker = {
            name: 'Magnemite',
            location: {
                lat: place.latitude,
                lng: place.longitude
            }
        }

        renderPlaces(placeMarker)
}


function renderPlaces(placeMarker) {
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
    
}