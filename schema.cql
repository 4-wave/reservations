DROP KEYSPACE IF EXISTS reservations

CREATE KEYSPACE reservations
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 2};

CREATE TABLE reservations.home(
  id int PRIMARY KEY,
  host_first_name text,
  host_last_name text,
  host_email text,
  cleaning_fee int,
  service_fee int,
  rating decimal,
  reviews int,
  max_guests int,
  base_price int,
  guest_increment int,
  day_increment int
);

CREATE TABLE reservations.reservation(
  home_id int,
  start date,
  end date,
  adults int,
  children int,
  infants int,
  cost int,
  user_email text,
  PRIMARY KEY (home_id, start)
WITH CLUSTERING ORDER BY (start ASC)
);

CREATE TABLE reservations.user(
  first_name text,
  last_name text,
  email text PRIMARY KEY
);
