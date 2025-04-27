let users = [];
let loggedInUser = null;
let patients = [];

function toggleForm(form) {
    document.getElementById('signin').style.display = form === 'signin' ? 'block' : 'none';
    document.getElementById('signup').style.display = form === 'signup' ? 'block' : 'none';
}

document.getElementById('signin-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        loggedInUser = user;
        toggleDashboard();
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        alert('User already exists!');
    } else {
        users.push({ username, password });
        alert('User created successfully! Please Sign In.');
        toggleForm('signin');
    }
});

function toggleDashboard() {
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const gender = document.getElementById('patient-gender').value;
    const address = document.getElementById('patient-address').value;
    const symptoms = document.getElementById('patient-symptoms').value;

    const patient = { name, age, gender, address, symptoms };
    patients.push(patient);
    alert('Patient added successfully!');
    document.getElementById('patient-form').reset();
    document.getElementById('add-patient-form').style.display = 'none';
});

function showAddPatientForm() {
    document.getElementById('add-patient-form').style.display = 'block';
}

function viewPatients() {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = '';
    patients.forEach(patient => {
        const li = document.createElement('li');
        li.innerHTML = `Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`;
        patientList.appendChild(li);
    });
}

function logout() {
    loggedInUser = null;
    document.getElementById('dashboard').style.display = 'none';
    toggleForm('signin');
}


