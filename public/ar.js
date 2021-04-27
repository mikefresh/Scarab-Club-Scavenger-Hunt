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
        model.setAttribute('clickhandler', '')
        model.setAttribute('emitevents', 'true');
        model.setAttribute('cursor','rayOrigin: mouse' )
        model.id = "animated-model"

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