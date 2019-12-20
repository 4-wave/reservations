DROP DATABASE IF EXISTS reservations;

CREATE DATABASE reservations;
\c reservations

CREATE TABLE home(
    id SERIAL PRIMARY KEY,
    host_first_name VARCHAR (50) NOT NULL,
    host_last_name VARCHAR (50) NOT NULL,
    host_email VARCHAR (200) UNIQUE NOT NULL,
    cleaning_fee INT NOT NULL,
    service_fee INT NOT NULL,
    rating DECIMAL NOT NULL,
    reviews INT NOT NULL,
    max_guests INT NOT NULL,
    base_price INT NOT NULL,
    guest_increment INT NOT NULL,
    day_increment INT NOT NULL
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (50),
    last_name VARCHAR (50),
    email VARCHAR (200)
);

CREATE TABLE reservation(
    id SERIAL PRIMARY KEY,
    start_date DATE UNIQUE NOT NULL,
    end_date DATE UNIQUE NOT NULL,
    adults INT,
    children INT,
    infants INT,
    cost INT,
    home_id INT,
    user_id INT,
    FOREIGN KEY (home_id) REFERENCES home(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);