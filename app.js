// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBvfmnKxsyKGpvdULLYv6SYHqfgRlWO75M",
    authDomain: "mrpi-40e83.firebaseapp.com",
    databaseURL: "https://mrpi-40e83-default-rtdb.firebaseio.com",
    projectId: "mrpi-40e83",
    storageBucket: "mrpi-40e83.firebasestorage.app",
    messagingSenderId: "1074708876532",
    appId: "1:1074708876532:web:4d896e384c1e5a7893e2a1",
    measurementId: "G-KBSLZZH0EX"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Authentication Logic (Sign Up, Sign In)
document.getElementById('signin-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    
    auth.signInWithEmailAndPassword(username, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('Sign-In Successful!');
            toggleDashboard();
        })
        .catch((error) => {
            alert('Invalid credentials: ' + error.message);
        });
});

document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(username, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('User created successfully! Please Sign In.');
            toggleForm('signin');
        })
        .catch((error) => {
            alert('Error signing up: ' + error.message);
        });
});

// Add Patient Data to Realtime Database
document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const gender = document.getElementById('patient-gender').value;
    const address = document.getElementById('patient-address').value;
    const symptoms = document.getElementById('patient-symptoms').value;

    const newPatientRef = db.ref('patients').push();
    newPatientRef.set({
        name: name,
        age: age,
        gender: gender,
        address: address,
        symptoms: symptoms
    })
    .then(() => {
        alert('Patient added successfully!');
        document.getElementById('patient-form').reset();
        document.getElementById('add-patient-form').style.display = 'none';
    })
    .catch((error) => {
        alert('Error adding patient: ' + error.message);
    });
});

// View Patients from Realtime Database
function viewPatients() {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = '';

    db.ref('patients').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const patient = childSnapshot.val();
            const li = document.createElement('li');
            li.innerHTML = `Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}, Address: ${patient.address}`;
            patientList.appendChild(li);
        });
    })
    .catch((error) => {
        alert('Error retrieving patients: ' + error.message);
    });
}

// Log out user
function logout() {
    auth.signOut()
        .then(() => {
            alert('Logged out successfully!');
            toggleForm('signin');
        })
        .catch((error) => {
            alert('Error logging out: ' + error.message);
        });
}

// Utility Functions for Form Toggle
function toggleForm(form) {
    document.getElementById('signin').style.display = form === 'signin' ? 'block' : 'none';
    document.getElementById('signup').style.display = form === 'signup' ? 'block' : 'none';
}

function toggleDashboard() {
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

function showAddPatientForm() {
    document.getElementById('add-patient-form').style.display = 'block';
}



