# Seminar Hall Booking System
---
## KTU S5 DBMS MICROPROJECT
---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

The **Seminar Hall Booking System** is a web application designed to streamline the process of booking seminar halls for various events. The system allows club executive committee members and teachers to log in, view available seminar halls, and make bookings. Admins can approve or deny these bookings, ensuring efficient management of the seminar hall resources.

## Features

- **User Authentication**: Secure login for club members and teachers.
- **Booking Management**: Users can view available halls, book them, and view their booking history.
- **Admin Dashboard**: Admins can view all bookings and have the ability to approve or deny requests.
- **Real-time Updates**: The system updates the booking status and availability in real-time.
- **Responsive Design**: The web application is designed to be user-friendly and responsive across devices.

## Technologies Used

- **Frontend**: 
  - HTML
  - CSS
  - JavaScript

- **Backend**: 
  - Node.js
  - Express.js
  - MySQL

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RAHULKRISHNAKR/Seminar_Hall_Booking_System.git
   cd Seminar_Hall_Booking_System
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Set up the MySQL database:**
   - Create a MySQL database and import the provided SQL scripts to set up the tables.
   - Update the database connection details in the server file if necessary.

4. **Run the server:**
   ```bash
   node server.js
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`.

## Usage

- **User Login**: Club members and teachers can log in using their credentials.
- **Book a Hall**: After logging in, users can select a hall and book it for a specified date and time.
- **Admin Access**: Admins can log in to manage bookings and view the status of requests.

## API Endpoints

| Method | Endpoint                | Description                           |
|--------|-------------------------|---------------------------------------|
| GET    | `/booked_halls`         | Fetch all booked halls                |
| POST   | `/admin/approve/:id`    | Approve a booking by ID               |
| POST   | `/admin/deny/:id`       | Deny a booking by ID                   |

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to create an issue or submit a pull request.
