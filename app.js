let db = firebase.firestore();

function getPlaces() {
  db.collection("places")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((document) => {
        console.log(document.data().name);
        var marker = new mapboxgl.Marker()
          .setLngLat([document.data().longitude, document.data().latitude])
          .addTo(map);
      });
    });
}

getPlaces();
