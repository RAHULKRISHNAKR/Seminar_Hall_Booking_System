# Digital Seminar Hall Booking System

## Overview

This project is a **Digital Seminar Hall Booking System** designed to streamline the process of booking seminar halls for various clubs and events within an institution. The system manages user roles (students, faculty, and admins), booking processes, approvals, and notifications, ensuring an efficient and organized booking experience.

## Features

### 1. User Roles and Permissions

#### Students and Faculty:
- Register and log in to the system.
- View available seminar halls and check open time slots.
- Make new bookings.
- View booking history.
- Receive notifications for booking confirmations, approvals, or rejections.

#### Admins:
- Log in and access an admin panel.
- View and manage booking requests.
- Approve or reject bookings.
- Add, update, or remove seminar halls.
- Manage user accounts.

### 2. Booking Management
- **Hall Selection**: Users select from a list of available seminar halls.
- **Event Details**: Users provide event name, description, and time slot.
- **Real-time Availability**: System checks hall availability for the requested time.
- **Pending Approval**: Bookings are pending admin approval.
- **Cancel Bookings**: Users can cancel bookings before approval.

### 3. Admin Approval System
- Admins review pending bookings and approve or reject requests.
- Remarks can be added for rejected bookings.
- Notifications are sent to users regarding the booking status.

### 4. Notifications (Optional)
- Real-time notifications are sent via email or displayed on the user dashboard for booking updates, approvals, or rejections.

### 5. Reporting and Logs (Optional)
- Admins can generate reports on booking statistics.
- Audit logs track user and admin activities.

## Database Design

The system uses a relational database to manage users, seminar halls, bookings, and approvals. Below is the database schema:

### 1. **Users Table**
Stores user information (students, faculty, and admins).

```sql
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

### 2. **Clubs Table**
Stores information about different clubs.

```sql
CREATE TABLE Clubs (
    club_id INT PRIMARY KEY AUTO_INCREMENT,
    club_name VARCHAR(100) UNIQUE NOT NULL
);
```

### 3. **User_Clubs Table**
Handles the many-to-many relationship between users and clubs.

```sql
CREATE TABLE User_Clubs (
    user_id INT,
    club_id INT,
    PRIMARY KEY (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id)
);
```

### 4. **SeminarHalls Table**
Stores seminar hall information.

```sql
CREATE TABLE SeminarHalls (
    hall_id INT PRIMARY KEY AUTO_INCREMENT,
    hall_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL
);
```

### 5. **Bookings Table**
Stores booking details, linking users, clubs, and seminar halls.

```sql
CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    hall_id INT,
    club_id INT,
    event_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (hall_id) REFERENCES SeminarHalls(hall_id),
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id)
);
```

### 6. **Approvals Table**
Records booking approvals by admins.

```sql
CREATE TABLE Approvals (
    approval_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    admin_id INT,
    status ENUM('approved', 'rejected') NOT NULL,
    remarks TEXT,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);
```

### 7. **Notifications Table (Optional)**
Stores notification messages for users.

```sql
CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT NOT NULL,
    date_sent DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

## System Requirements

### Backend
- **Programming Language**: Python (Flask/Django), Java (Spring), or Node.js.
- **Database**: MySQL, PostgreSQL, or another RDBMS.
- **Web Server**: Apache, Nginx, or a cloud platform like Heroku for deployment.

### Frontend
- **Languages**: HTML, CSS, JavaScript.
- **Frameworks**: Bootstrap, React.js, or Vue.js.

### External APIs or Libraries
- Email notifications: Libraries like Python's `smtplib` or external services like SendGrid.
- Authentication: Libraries for password hashing (e.g., `bcrypt`) and session management.

## Use Case Scenarios

1. **Student/Faculty Booking a Hall**:
   - User logs in, selects a hall, and submits a booking request.
   
2. **Admin Managing Requests**:
   - Admin reviews and approves/rejects booking requests.
   
3. **User Receiving Notifications**:
   - User receives notifications on booking approval or rejection.

## UML Diagrams

### Use Case Diagram

Shows how different users interact with the system:
- **Actors**: Student/Faculty and Admin.
- **Use Cases**: Login, register, view halls, make a booking, check status, approve/reject booking, manage halls and users.

### Class Diagram

Defines system structure with classes such as `User`, `SeminarHall`, `Booking`, and `Approval`. Relationships between classes show the static structure.

### Activity Diagram

Outlines the process flow of booking a seminar hall, from login to receiving booking status notifications.
