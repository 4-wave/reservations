const mysql = require('mysql');
const Promise = require('bluebird');

const connection = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: 'Password',
  database: 'reservations',
});

connection.connect();

const connectionAsync = Promise.promisifyAll(connection);

module.exports = {
  houses: (fakeData) => {
    const queryVal = [fakeData.price_per_night, fakeData.cleaning_fees, fakeData.service_fees, fakeData.average_rating, fakeData.number_of_reviews];
    const query = 'INSERT INTO reservation (price_per_night, cleaning_fees, service_fees, average_rating, number_of_reviews) VALUES(?, ?, ?, ?, ?)';
    return connectionAsync.queryAsync(query, queryVal).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  },
  dates: (fakeData) => {
    const queryVal = [fakeData.room_id, fakeData.reservation_start, fakeData.reservation_end];
    const query = 'INSERT INTO details (room_id, reservation_start, reservation_end) VALUES(?, ?, ?)';
    return connectionAsync.queryAsync(query, queryVal).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  },
  getPrice: (callback, id) => {
    connection.query(`SELECT * from reservation where id = ${id};`, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  },
  getDates: (callback, id) => {
    connection.query(`SELECT * from details where room_id = ${id};`, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  },
};
