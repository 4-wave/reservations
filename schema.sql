DROP DATABASE IF EXISTS reservations;

CREATE DATABASE reservations;
\c reservations;

CREATE TABLE homes(
    id SERIAL PRIMARY KEY,
    host_first_name VARCHAR (50) NOT NULL,
    host_last_name VARCHAR (50) NOT NULL,
    host_email VARCHAR (200) NOT NULL,
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

CREATE TABLE reservations(
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    adults INT,
    children INT,
    infants INT,
    cost INT,
    homes_id INT,
    users_id INT,
    FOREIGN KEY (homes_id) REFERENCES homes(id),
    FOREIGN KEY (users_id) REFERENCES users(id)
);