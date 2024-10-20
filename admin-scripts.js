document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch and display bookings
    function fetchBookings() {
        fetch('http://localhost:3000/admin/bookings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const tableBody = document.querySelector('#bookings-table tbody');
                tableBody.innerHTML = ''; // Clear existing table rows
                data.bookings.forEach(booking => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${booking.event_name}</td>
                        <td>${booking.date}</td>
                        <td>${booking.start_time}</td>
                        <td>${booking.end_time}</td>
                        <td>${booking.status}</td>
                        <td>
                            <button onclick="approveBooking(${booking.booking_id})">Approve</button>
                            <button onclick="denyBooking(${booking.booking_id})">Deny</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching bookings:', error));
    }

    // Fetch bookings immediately on page load
    fetchBookings();

    // Set interval to fetch bookings every 5 seconds (5000 ms)
    setInterval(fetchBookings, 5000); // Adjust the interval as needed
});

// Function to approve booking
function approveBooking(bookingId) {
    fetch(`http://localhost:3000/admin/approve/${bookingId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Booking approved!');
                location.reload(); // Reload the table
            } else {
                alert('Failed to approve booking.');
            }
        })
        .catch(error => console.error('Error approving booking:', error));
}

// Function to deny booking
function denyBooking(bookingId) {
    fetch(`http://localhost:3000/admin/deny-booking/${bookingId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Booking denied!');
                location.reload(); // Reload the table
            } else {
                alert('Failed to deny booking.');
            }
        })
        .catch(error => console.error('Error denying booking:', error));
}
