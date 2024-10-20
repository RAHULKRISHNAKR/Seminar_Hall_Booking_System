// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Login successful!');
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('booking-section').style.display = 'block';
        } else {
            alert('Login failed!');
        }
    });
});

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const event_name = document.getElementById('event_name').value;
    const hall_id = document.getElementById('hall_id').value;
    const club_id = document.getElementById('club_id').value;
    const date = document.getElementById('date').value;
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;

    fetch('http://localhost:3000/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: 1, hall_id, club_id, event_name, date, start_time, end_time })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Booking successful!');
        } else {
            alert('Booking failed!');
        }
    });
});
