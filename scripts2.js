document.addEventListener('DOMContentLoaded', () => {
    // Function to format date for better display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    // Function to fetch and display booked halls
    function fetchBookedHalls() {
        fetch('http://localhost:3000/booked_halls')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data.bookings) {
                    throw new Error('No bookings data received');
                }

                const tableBody = document.querySelector('#booked-halls-table tbody');
                tableBody.innerHTML = ''; // Clear existing table rows

                if (data.bookings.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="6">No approved bookings found</td>';
                    tableBody.appendChild(row);
                    return;
                }

                data.bookings.forEach(booking => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${booking.event_name || 'N/A'}</td>
                        <td>${booking.hall_name || 'N/A'}</td>
                        <td>${booking.date ? formatDate(booking.date) : 'N/A'}</td>
                        <td>${booking.start_time || 'N/A'}</td>
                        <td>${booking.end_time || 'N/A'}</td>
                        <td>${booking.club_name || 'N/A'}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching booked halls:', error);
                const tableBody = document.querySelector('#booked-halls-table tbody');
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6">Error loading bookings. Please try again later.</td>
                    </tr>
                `;
            });
    }

    // Initial fetch when page loads
    fetchBookedHalls();

    // Optional: Refresh the data periodically
    setInterval(fetchBookedHalls, 30000); // Refresh every 30 seconds
});