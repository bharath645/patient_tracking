// Initialize Firebase
// Firebase Configuration
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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

let loggedInUser = null;
let users = [];

// Function to toggle between forms
function toggleForm(form) {
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';

    if (form === 'signin') {
        document.getElementById('signin').style.display = 'block';
    } else if (form === 'signup') {
        document.getElementById('signup').style.display = 'block';
    } else if (form === 'dashboard') {
        document.getElementById('dashboard').style.display = 'block';
    }
}

// Sign In Form Submission
document.getElementById('signin-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            loggedInUser = userCredential.user;
            toggleForm('dashboard');
        })
        .catch((error) => {
            alert('Invalid credentials');
        });
});

// Sign Up Form Submission
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            loggedInUser = userCredential.user;
            toggleForm('dashboard');
        })
        .catch((error) => {
            alert('Error creating user');
        });
});

// Logout Function
function logout() {
    auth.signOut()
        .then(() => {
            loggedInUser = null;
            toggleForm('signin');
        })
        .catch((error) => {
            console.error('Error signing out', error);
        });
}

// Show Add Patient Form
function showAddPatientForm() {
    document.getElementById('add-patient-form').style.display = 'block';
}

// Add Patient to Firebase
document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const gender = document.getElementById('patient-gender').value;
    const address = document.getElementById('patient-address').value;
    const symptoms = document.getElementById('patient-symptoms').value;

    const patientRef = database.ref('patients');
    patientRef.push({
        name,
        age,
        gender,
        address,
        symptoms
    });

    alert('Patient added successfully!');
    document.getElementById('patient-form').reset();
    document.getElementById('add-patient-form').style.display = 'none';
});

// View All Patients
function viewPatients() {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = '';

    const patientRef = database.ref('patients');
    patientRef.on('value', (snapshot) => {
        const patients = snapshot.val();
        for (let id in patients) {
            const patient = patients[id];
            const li = document.createElement('li');
            li.innerHTML = `Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`;
            patientList.appendChild(li);
        }
    });
}







