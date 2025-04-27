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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Database services
const auth = firebase.auth();
const database = firebase.database();

// Function to toggle between Sign In and Sign Up forms
function toggleForm(form) {
    document.getElementById('signin').style.display = form === 'signin' ? 'block' : 'none';
    document.getElementById('signup').style.display = form === 'signup' ? 'block' : 'none';
}

// Sign Up functionality
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(username, password)
        .then((userCredential) => {
            const user = userCredential.user;
            database.ref('users/' + user.uid).set({
                username: username,
                email: user.email
            })
            .then(() => {
                alert('User created successfully! Please Sign In.');
                toggleForm('signin');
            })
            .catch((error) => {
                alert('Error storing user data: ' + error.message);
            });
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Sign In functionality
document.getElementById('signin-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    auth.signInWithEmailAndPassword(username, password)
        .then((userCredential) => {
            loggedInUser = userCredential.user;
            toggleDashboard();
        })
        .catch((error) => {
            alert('Invalid credentials');
        });
});

// Toggle Dashboard visibility after sign-in
function toggleDashboard() {
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// Function to view patients from Firebase Database
function viewPatients() {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = '';

    database.ref('patients').once('value')
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const patient = childSnapshot.val();
                const li = document.createElement('li');
                li.innerHTML = `Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`;
                patientList.appendChild(li);
            });
        })
        .catch((error) => {
            console.error('Error fetching patients:', error);
        });
}

// Function to add patient to Firebase Database
document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const gender = document.getElementById('patient-gender').value;
    const address = document.getElementById('patient-address').value;
    const symptoms = document.getElementById('patient-symptoms').value;

    const patient = { name, age, gender, address, symptoms };

    database.ref('patients').push(patient)
        .then(() => {
            alert('Patient added successfully!');
            document.getElementById('patient-form').reset();
            document.getElementById('add-patient-form').style.display = 'none';
        })
        .catch((error) => {
            alert('Error adding patient: ' + error.message);
        });
});

// Function to show the Add Patient Form
function showAddPatientForm() {
    document.getElementById('add-patient-form').style.display = 'block';
}

// Logout functionality
function logout() {
    auth.signOut()
        .then(() => {
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('signin').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
}




