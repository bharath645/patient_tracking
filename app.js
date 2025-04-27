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
const auth = firebase.auth();
const database = firebase.database();

// Toggle between Sign In and Sign Up Forms
function toggleForm(form) {
    document.getElementById('signin').style.display = form === 'signin' ? 'block' : 'none';
    document.getElementById('signup').style.display = form === 'signup' ? 'block' : 'none';
}

// Sign In
document.getElementById('signin-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // On successful login, toggle to the dashboard view
            toggleDashboard();
        })
        .catch(error => {
            alert(error.message);
        });
});

// Sign Up
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("User created successfully!");
            toggleForm('signin');
        })
        .catch(error => {
            alert(error.message);
        });
});

// Toggle Dashboard visibility (called after login)
function toggleDashboard() {
    // Hide Sign-In and Sign-Up forms
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    
    // Show Dashboard
    document.getElementById('dashboard').style.display = 'block';
    
    // Optionally, you can show the patients right after login
    viewPatients();
}

// Show Add Patient Form
function showAddPatientForm() {
    document.getElementById('add-patient-form').style.display = 'block';
}

// View Patients
function viewPatients() {
    const userId = auth.currentUser.uid;
    const patientRef = database.ref('patients/' + userId);

    patientRef.once('value', snapshot => {
        const patientList = document.getElementById('patient-list');
        patientList.innerHTML = '';

        snapshot.forEach(childSnapshot => {
            const patient = childSnapshot.val();
            const li = document.createElement('li');
            li.innerHTML = `Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`;
            patientList.appendChild(li);
        });
    });
}

// Add Patient
document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const gender = document.getElementById('patient-gender').value;
    const address = document.getElementById('patient-address').value;
    const symptoms = document.getElementById('patient-symptoms').value;

    const patientData = {
        name,
        age,
        gender,
        address,
        symptoms
    };

    // Save patient data to Firebase Realtime Database
    const userId = auth.currentUser.uid;
    const patientRef = database.ref('patients/' + userId);
    patientRef.push(patientData);

    alert("Patient added successfully!");
    document.getElementById('patient-form').reset();
    document.getElementById('add-patient-form').style.display = 'none';
    viewPatients(); // Refresh patient list after adding
});

// Logout
function logout() {
    auth.signOut().then(() => {
        document.getElementById('dashboard').style.display = 'none';
        toggleForm('signin');
    });
}

// Listen for auth state changes (if the user is already logged in)
auth.onAuthStateChanged(user => {
    if (user) {
        toggleDashboard();  // Automatically go to dashboard if already signed in
    } else {
        toggleForm('signin'); // Show sign-in form if not logged in
    }
});










