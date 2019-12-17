
Create database if not exists reservations;
use reservations;

create table if not exists reservation(
    id int AUTO_INCREMENT PRIMARY KEY,
    price_per_night int(25),
    cleaning_fees int(25),
    service_fees int(25),
    average_rating float(2),
    number_of_reviews int(25)
);

create table if not exists details(
    id int AUTO_INCREMENT PRIMARY KEY,
    room_id int(35),
    reservation_start date,
    reservation_end date,  
    foreign key (room_id) references reservation(id)
);