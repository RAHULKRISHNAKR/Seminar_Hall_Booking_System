document.addEventListener('DOMContentLoaded', () => {
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
                tableBody.innerHTML = '';
                data.bookings.forEach(booking => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${booking.event_name}</td>
                        <td>${booking.hall_name}</td>
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

    fetchBookings();
    setInterval(fetchBookings, 5000);
});

// Function to approve booking
function approveBooking(bookingId) {
    fetch(`http://localhost:3000/admin/approve/${bookingId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Booking approved!');
                location.reload();
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
                location.reload();
            } else {
                alert('Failed to deny booking.');
            }
        })
        .catch(error => console.error('Error denying booking:', error));
}