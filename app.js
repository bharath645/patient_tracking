// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, set, push, get, child } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlorE3q4pRyYpCIUSsnAhWyEfKNOoNL54",
  authDomain: "mrpi-a6e28.firebaseapp.com",
  databaseURL: "https://mrpi-a6e28-default-rtdb.firebaseio.com",
  projectId: "mrpi-a6e28",
  storageBucket: "mrpi-a6e28.firebasestorage.app",
  messagingSenderId: "964527902093",
  appId: "1:964527902093:web:7ff943a71eee3d1fa901c4",
  measurementId: "G-H1RRHM61B6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

// Sign Up Function
document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      alert('User created successfully! Please Sign In.');
      toggleForm('signin');
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Sign In Function
document.getElementById('signin-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('signin-username').value;
  const password = document.getElementById('signin-password').value;

  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      loggedInUser = user;
      toggleDashboard();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Logout Function
function logout() {
  signOut(auth).then(() => {
    loggedInUser = null;
    document.getElementById('dashboard').style.display = 'none';
    toggleForm('signin');
  }).catch((error) => {
    console.log(error.message);
  });
}

// Add Patient Function
document.getElementById('patient-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('patient-name').value;
  const age = document.getElementById('patient-age').value;
  const gender = document.getElementById('patient-gender').value;
  const address = document.getElementById('patient-address').value;
  const symptoms = document.getElementById('patient-symptoms').value;

  const patient = { name, age, gender, address, symptoms };

  // Get a reference to the database path
  const patientRef = ref(database, 'patients/');

  // Push the new patient data to Firebase Realtime Database
  push(patientRef, patient)
    .then(() => {
      alert('Patient added successfully!');
      document.getElementById('patient-form').reset();
      document.getElementById('add-patient-form').style.display = 'none';
    })
    .catch((error) => {
      console.log(error.message);
    });
});

// View Patients Function
function viewPatients() {
  const patientList = document.getElementById('patient-list');
  patientList.innerHTML = '';  // Clear previous list

  // Get a reference to the patients path in the database
  const patientRef = ref(database, 'patients/');

  get(patientRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const patientsData = snapshot.val();
        for (const patientId in patientsData) {
          const patient = patientsData[patientId];
          const li = document.createElement('li');
          li.innerHTML = `Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`;
          patientList.appendChild(li);
        }
      } else {
        alert('No patients found');
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
}

