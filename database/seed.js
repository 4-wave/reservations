const faker = require('faker');
// const Promise = require('bluebird');
const Models = require('../server/models.js');

function houses() {
  var final = [];
  for (let i = 0; i < 100; i += 1) {
    const randomPrice = faker.random.number(200);
    const cleaningPrice = faker.random.number(50);
    const serviceFees = faker.random.number(50);
    const reviews = faker.finance.amount(0, 5, 2);
    const rewievers = faker.random.number(500);

    final.push(Models.houses({
      price_per_night: randomPrice,
      cleaning_fees: cleaningPrice,
      service_fees: serviceFees,
      average_rating: reviews,
      number_of_reviews: rewievers,
    }));
  }
  return Promise.all(final);
}

function dates() {
  var finalArray = [];
  for (let i = 0; i < 100; i += 1) {
    var temp = 0;
    for (let j = 1; j <= 5; j += 1) {
      if (temp === 0) {
        const checkIn = faker.date.between('2019-12-01', `2020-0${j}-31`);
        const checkOut = faker.date.between(checkIn, `2020-0${j + 1}-31`);
        temp = checkOut;
        finalArray.push(Models.dates({ room_id: i, reservation_start: checkIn, reservation_end: checkOut }));
      }
      const checkIn = faker.date.between(temp, `2020-0${j}-31`);
      const checkOut = faker.date.between(checkIn, `2020-0${j + 1}-31`);
      temp = checkOut;
      finalArray.push(Models.dates({ room_id: i, reservation_start: checkIn, reservation_end: checkOut }));
    }
  }
  return Promise.all(finalArray);
}

// const test = Promise.all([houses(), dates()]);

houses().then(() => dates()).then(() => {
  process.exit(0);
});


// houses();
// dates();
