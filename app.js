// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

// Toggle between sign-in and sign-up forms
function toggleForm(form) {
    document.getElementById('signin').style.display = form === 'signin' ? 'block' : 'none';
    document.getElementById('signup').style.display = form === 'signup' ? 'block' : 'none';
}

// Sign up form submit
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('User created successfully! Please Sign In.');
            toggleForm('signin');
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});

// Sign in form submit
document.getElementById('signin-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            toggleDashboard();
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});

// Toggle to dashboard
function toggleDashboard() {
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// Add patient form submit
document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const gender = document.getElementById('patient-gender').value;
    const address = document.getElementById('patient-address').value;
    const symptoms = document.getElementById('patient-symptoms').value;

    const patient = {
        name,
        age,
        gender,
        address,
        symptoms
    };

    const patientRef = ref(db, 'patients/' + new Date().getTime());
    set(patientRef, patient).then(() => {
        alert('Patient added successfully!');
        document.getElementById('patient-form').reset();
        document.getElementById('add-patient-form').style.display = 'none';
    }).catch((error) => {
        alert('Error saving patient data: ' + error.message);
    });
});

// Show the add patient form
function showAddPatientForm() {
    document.getElementById('add-patient-form').style.display = 'block';
}

// View patients
function viewPatients() {
    const patientList = document.getElementById('patient-list');
    const reference = ref(db, 'patients/');

    get(reference).then((snapshot) => {
        if (snapshot.exists()) {
            const patients = snapshot.val();
            patientList.innerHTML = '';

            Object.keys(patients).forEach(key => {
                const patient = patients[key];
                const li = document.createElement('li');
                li.innerHTML = `Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`;
                patientList.appendChild(li);
            });
        } else {
            console.log('No patients found');
        }
    }).catch((error) => {
        console.error('Error fetching patients: ' + error.message);
    });
}

// Logout function
function logout() {
    signOut(auth)
        .then(() => {
            document.getElementById('dashboard').style.display = 'none';
            toggleForm('signin');
        })
        .catch((error) => {
            alert('Error logging out: ' + error.message);
        });
}





