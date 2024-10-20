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

//booking

const club_name = document.getElementById('club_name').value;
console.log('Submitting club name:', club_name); // Log the club name being submitted
// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const event_name = document.getElementById('event_name').value;
    const hall_id = document.getElementById('hall_id').value;
    const club_name = document.getElementById('club_name').value; // Ensure this input exists
    const date = document.getElementById('date').value;
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;

    // Input validation for club name
    if (!club_name) {
        alert('Please enter a club name!');
        return; // Exit the function if club name is not provided
    }

    // Fetch the club ID using the club name
    fetch(`http://localhost:3000/clubs/${club_name}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'fail') {
                alert('Club not found!');
                return; // Exit if club is not found
            }

            // If club is found, proceed with the booking
            const club_id = data.club_id; // Get the club ID from the response

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
                    // Redirect to booking summary or show confirmation
                    window.location.href = 'booking-summary.html?booking_id=' + data.booking_id; // Assuming you want to redirect
                } else {
                    alert('Booking failed!');
                }
            });
        })
        .catch(error => {
            console.error('Error fetching club ID:', error);
            alert('An error occurred while checking the club name. Please try again.');
        });
});
