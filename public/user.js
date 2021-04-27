document.addEventListener('DOMContentLoaded', function() {

btnLogout.addEventListener("click", logout);

firebase.auth().onAuthStateChanged((firebaseuser) => {
  if (firebaseuser) {
    setupUser(firebaseuser);
  }
});

function logout() {
  firebase.auth().signOut();
  window.location.href = "/index.html";
  console.log("Logging out");
}

function setupUser(user) {
  userName.innerHTML = user.displayName;
}

});