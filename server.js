const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Middleware to parse incoming request bodies and allow cross-origin requests
app.use(cors());
app.use(bodyParser.json());

// Set up your MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // your MySQL username
    password: 'rahul123',  // your MySQL password
    database: 'SeminarHallBooking' // your database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
});


app.get('/test-db', (req, res) => {
    db.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Database test failed:', err);
            return res.status(500).json({ error: 'Database connection failed' });
        }
        res.json({ message: 'Database connection successful' });
    });
});


// Route to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE name = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json({ status: 'success', user: result[0] });
        } else {
            res.json({ status: 'fail' });
        }
    });
});

// Correct /admin-login route
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    console.log('Admin login attempt:', username); // Log the username for debugging
    
    const sql = 'SELECT * FROM Users WHERE name = ? AND password = ? AND role = "admin"'; // Assuming "admin" role is defined
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Database error:', err); // Log any database error
            return res.status(500).json({ status: 'error' }); // Respond with an error status
        }
        
        if (result.length > 0) {
            res.json({ status: 'success', user: result[0] });
        } else {
            res.json({ status: 'fail' });
        }
    });
});
// Route to get club ID by club name
app.get('/clubs/:name', (req, res) => {
    const clubName = req.params.name;
    console.log('Received club name:', clubName); // Log the received club name
    const sql = 'SELECT club_id FROM Clubs WHERE club_name = ?';
    db.query(sql, [clubName], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ status: 'error', message: 'Database query failed' });
        }
        if (result.length > 0) {
            res.json({ status: 'success', club_id: result[0].club_id });
        } else {
            console.log('Club not found in database'); // Log when club is not found
            res.json({ status: 'fail', message: 'Club not found' });
        }
    });
});



// Route to handle bookings
// Update the booking route in your Express server

app.post('/book', async (req, res) => {
    const { user_id, hall_id, club_id, event_name, date, start_time, end_time } = req.body;

    // First check if the hall is available
    const checkAvailability = `
        SELECT COUNT(*) as count
        FROM Bookings
        WHERE hall_id = ?
        AND date = ?
        AND status = 'approved'
        AND (
            (start_time < ? AND end_time > ?)
            OR (start_time < ? AND end_time > ?)
            OR (start_time >= ? AND end_time <= ?)
        )
    `;

    try {
        db.query(
            checkAvailability,
            [hall_id, date, end_time, start_time, end_time, start_time, start_time, end_time],
            (err, results) => {
                if (err) {
                    console.error('Availability check error:', err);
                    return res.status(500).json({ 
                        status: 'error',
                        error: 'Database error while checking availability'
                    });
                }

                if (results[0].count > 0) {
                    return res.status(409).json({
                        status: 'error',
                        error: 'Hall is not available for the selected date and time.'
                    });
                }

                // If hall is available, proceed with booking
                const insertBooking = `
                    INSERT INTO Bookings 
                    (user_id, hall_id, club_id, event_name, date, start_time, end_time, status, booking_time)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
                `;

                db.query(
                    insertBooking,
                    [user_id, hall_id, club_id, event_name, date, start_time, end_time],
                    (err, result) => {
                        if (err) {
                            console.error('Booking insertion error:', err);
                            return res.status(500).json({
                                status: 'error',
                                error: 'Failed to create booking'
                            });
                        }

                        res.json({
                            status: 'success',
                            booking_id: result.insertId
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error'
        });
    }
});

// Admin bookings route
/* app.get('/admin/bookings', (req, res) => {
    const query = 'SELECT * FROM bookings'; // Ensure the table name is correct
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ bookings: results });
    });
}); */

// Admin bookings route
app.get('/admin/bookings', (req, res) => {
    const query = `
        SELECT 
            b.*,
            sh.hall_name
        FROM 
            Bookings b
            JOIN SeminarHalls sh ON b.hall_id = sh.hall_id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ bookings: results });
    });
});

// Route to approve booking
app.post('/admin/approve/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;
    const sql = 'UPDATE Bookings SET status = "approved" WHERE booking_id = ?';
    db.query(sql, [bookingId], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Booking approved successfully.' });
    });
});

app.post('/admin/deny-booking/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;
    const sql = 'DELETE FROM Bookings WHERE booking_id = ?';
    
    db.query(sql, [bookingId], (err, result) => {
        if (err) {
            console.error('Error denying booking:', err);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Failed to deny booking.' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Booking not found.' 
            });
        }
        
        res.json({ 
            status: 'success', 
            message: 'Booking denied successfully!' 
        });
    });
});


// Route to fetch a specific booking by its booking ID
app.get('/bookings/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;
    const sql = 'SELECT * FROM Bookings WHERE booking_id = ?';
    db.query(sql, [bookingId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ status: 'error', message: 'Database query failed' });
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ status: 'fail', message: 'Booking not found' });
        }
    });
});

app.post('/check-availability', (req, res) => {
    const { hall_id, date, start_time, end_time } = req.body;

    const query = `
        SELECT COUNT(*) as count
        FROM Bookings
        WHERE hall_id = ?
        AND date = ?
        AND status = 'approved'
        AND (
            (start_time < ? AND end_time > ?)
            OR (start_time < ? AND end_time > ?)
            OR (start_time >= ? AND end_time <= ?)
        )
    `;

    db.query(
        query,
        [hall_id, date, end_time, start_time, end_time, start_time, start_time, end_time],
        (err, results) => {
            if (err) {
                console.error('Availability check error:', err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error checking hall availability'
                });
            }

            if (results[0].count > 0) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Hall is not available for the selected time slot'
                });
            }

            res.json({
                status: 'success',
                message: 'Hall is available'
            });
        }
    );
});

// Endpoint to fetch approved booked halls with hall names and club names
app.get('/booked_halls', (req, res) => {
    const sql = `
        SELECT 
            b.event_name,
            b.date,
            b.start_time,
            b.end_time,
            c.club_name,
            sh.hall_name
        FROM 
            Bookings b
            JOIN Clubs c ON b.club_id = c.club_id
            JOIN SeminarHalls sh ON b.hall_id = sh.hall_id
        WHERE 
            b.status = 'approved'
        ORDER BY 
            b.date, b.start_time`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Failed to fetch booked halls.' 
            });
        }
        res.json({ 
            status: 'success',
            bookings: results 
        });
    });
});
// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

