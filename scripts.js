/* /* // Handle login form submission
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
 */

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
    const club_name = document.getElementById('club_name').value;
    const date = document.getElementById('date').value;
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;

    // Input validation for club name
    if (!club_name) {
        alert('Please enter a club name!');
        return;
    }

    // Additional validation for date and time
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('Please select a future date!');
        return;
    }

    if (start_time >= end_time) {
        alert('End time must be after start time!');
        return;
    }

    // First check if the hall is available
    fetch(`http://localhost:3000/check-availability`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hall_id,
            date,
            start_time,
            end_time
        })
    })
    .then(response => response.json())
    .then(availabilityData => {
        if (availabilityData.status === 'error') {
            alert(availabilityData.message || 'Hall is not available for the selected time slot.');
            return;
        }

        // If hall is available, proceed with club ID fetch and booking
        return fetch(`http://localhost:3000/clubs/${encodeURIComponent(club_name)}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'fail') {
                    alert('Club not found!');
                    throw new Error('Club not found');
                }
                return data.club_id;
            })
            .then(club_id => {
                // Proceed with booking
                return fetch('http://localhost:3000/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: 1,
                        hall_id,
                        club_id,
                        event_name,
                        date,
                        start_time,
                        end_time
                    })
                });
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Booking request submitted successfully! Awaiting admin approval.');
                    // Redirect to booking summary
                    window.location.href = 'booking-summary.html?booking_id=' + data.booking_id;
                } else if (data.error && data.error.includes('Hall is not available')) {
                    alert('This hall is already booked for the selected time slot. Please choose a different time or hall.');
                } else {
                    alert('Booking failed! Please try again.');
                }
            });
    })
    .catch(error => {
        console.error('Error during booking process:', error);
        alert('An error occurred during the booking process. Please try again.');
    });
});

// Add event listener for date input to prevent past dates
document.getElementById('date').addEventListener('change', function(e) {
    const selectedDate = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('Please select a future date!');
        this.value = '';
    }
});

// Add event listeners for time inputs to ensure end time is after start time
document.getElementById('start_time').addEventListener('change', validateTimes);
document.getElementById('end_time').addEventListener('change', validateTimes);

function validateTimes() {
    const startTime = document.getElementById('start_time').value;
    const endTime = document.getElementById('end_time').value;

    if (startTime && endTime && startTime >= endTime) {
        alert('End time must be after start time!');
        document.getElementById('end_time').value = '';
    }
} 