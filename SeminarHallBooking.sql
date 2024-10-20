CREATE DATABASE SeminarHallBooking;
USE SeminarHallBooking;

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('club', 'teacher', 'admin') NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Clubs (
    club_id INT PRIMARY KEY AUTO_INCREMENT,
    club_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE User_Clubs (
    user_id INT,
    club_id INT,
    PRIMARY KEY (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id)
);

CREATE TABLE SeminarHalls (
    hall_id INT PRIMARY KEY AUTO_INCREMENT,
    hall_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL
);

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
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (hall_id) REFERENCES SeminarHalls(hall_id),
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id)
);

CREATE TABLE Approvals (
    approval_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    admin_id INT,
    status ENUM('approved', 'rejected') NOT NULL,
    remarks TEXT,
    decision_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

CREATE TABLE Availability (
    hall_id INT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('available', 'booked') DEFAULT 'available',
    PRIMARY KEY (hall_id, date, start_time, end_time),
    FOREIGN KEY (hall_id) REFERENCES SeminarHalls(hall_id)
);

INSERT INTO SeminarHalls (hall_name, capacity)
VALUES 
('Seminar Hall 1', 100),
('Seminar Hall 2', 100),
('Seminar Hall 3', 100),
('Seminar Hall 4', 100),
('Seminar Hall 5', 100),
('Seminar Hall 6', 100);

INSERT INTO Clubs (club_name)
VALUES 
('ASCE'),
('ASME'),
('BPCL Kochi Refinery ENCON Club'),
('Computer Science Association'),
('DIVAAT'),
('DEBATE CLUB'),
('ENCIDE'),
('Fine Arts Club'),
('HORTICULTURE CLUB'),
('IEDC'),
('IEEE'),
('IIC'),
('ISTE'),
('Mace Film Society'),
('MADc'),
('MMC'),
('NETX'),
('NSS'),
('QUIZ CLUB'),
('SAE'),
('SPARSHAM CELL'),
('TINKERHUB'),
('TnP MACE');

SHOW TABLES;
SELECT * FROM Clubs;

-- Insert Users
INSERT INTO Users (name, email, role, password) VALUES
('Rahul', 'demo1@example.com', 'club', 'pass123'),
('Vignesh', 'demo2@example.com', 'club', 'pass456'),
('Nibras', 'demo3@example.com', 'club', 'pass789'),
('Azeem', 'demo4@example.com', 'club', 'pass987'),
('Alan', 'demo5@example.com', 'club', 'pass654'),
('Chacko', 'demo6@example.com', 'club', 'pass321'),
('Anu', 'demo7@example.com', 'teacher', 'pass001'),
('Asha', 'demo8@example.com', 'teacher', 'pass001'),
('Jisha', 'demo9@example.com', 'teacher', 'pass001'),
('admin', 'admin@example.com', 'admin', 'admin123');

-- Insert User-Club Relationships
INSERT INTO User_Clubs (user_id, club_id) VALUES
(1, 6),  -- Rahul -> ENCIDE
(2, 1),  -- Vignesh -> ASCE
(3, 3),  -- Nibras -> BPCL Kochi Refinery ENCON Club
(4, 4),  -- Azeem -> Computer Science Association
(5, 2),  -- Alan -> ASME
(6, 5);  -- Chacko -> DIVAAT

show tables;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rahul123';
FLUSH PRIVILEGES;

INSERT INTO Users (name, email, password, role) 
VALUES ('Test User', 'test@example.com', 'user123', 'teacher');

select * from users;

SELECT * FROM Users WHERE name = 'admin' AND password = 'admin123' AND role = 'admin';

select * from bookings;

DELIMITER //

CREATE TRIGGER before_booking_insert
BEFORE INSERT ON Bookings
FOR EACH ROW
BEGIN
    DECLARE hall_availability INT;

    -- Check if the hall is available
    SELECT COUNT(*)
    INTO hall_availability
    FROM Availability
    WHERE hall_id = NEW.hall_id
    AND date = NEW.date
    AND (
        (start_time < NEW.end_time AND end_time > NEW.start_time)  -- Check for overlapping times
    )
    AND status = 'booked';  -- Only consider booked statuses

    -- If the hall is already booked, signal an error
    IF hall_availability > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Hall is not available for the selected date and time.';
    END IF;

    -- If available, mark the hall as booked
    UPDATE Availability
    SET status = 'booked'
    WHERE hall_id = NEW.hall_id
    AND date = NEW.date
    AND (
        (start_time < NEW.end_time AND end_time > NEW.start_time)  -- Ensure this condition is consistent
    );
END; //

DELIMITER ;
