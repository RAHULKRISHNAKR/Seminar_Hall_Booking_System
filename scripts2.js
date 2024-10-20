document.addEventListener('DOMContentLoaded', () => {
    // Fetch Booked Halls when the button is clicked
    document.querySelector('.secondary-btn').addEventListener('click', () => {
        window.location.href = 'booked_halls.html'; // Redirect to the new page
    });
});

// Function to fetch and display booked halls in booked_halls.html
function fetchBookedHalls() {
    fetch('http://localhost:3000/booked_halls')  // Adjust this endpoint as needed
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#booked-halls-table tbody');
            tableBody.innerHTML = ''; // Clear existing table rows
            data.bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.event_name}</td>
                    <td>${booking.date}</td>
                    <td>${booking.start_time}</td>
                    <td>${booking.end_time}</td>
                    <td>${booking.club_name}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching booked halls:', error));
}

// Call fetchBookedHalls when the booked_halls.html is loaded
document.addEventListener('DOMContentLoaded', fetchBookedHalls);
