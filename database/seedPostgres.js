const faker = require('faker');
const fs = require('fs').promises;
const path = require('path');
const client = require('./indexPostgres.js');

let homes = '';
let users = '';
let reservations = '';
for (let i = 1; i <= 100; i++) {
  // generate 10,000,000 homes 
  const host_first_name = faker.name.firstName();
  const host_last_name = faker.name.lastName();
  const host_email = faker.internet.email();
  const cleaning_fee = faker.finance.amount(10, 30, 0);
  const rating = faker.finance.amount(2, 5, 2);
  const reviews = faker.finance.amount(0, 500, 0);
  const base_price = faker.finance.amount(25, 250, 0);
  const service_fee = Math.floor(0.4 * base_price);
  let max_guests;
  if (base_price < 100) {
    max_guests = faker.finance.amount(1, 3, 0);
  } else {
    max_guests = faker.finance.amount(2, 10, 0);
  }
  if (max_guests === 1) {
    let guest_increment = 0;
  } else {
    guest_increment = faker.finance.amount(0, 20, 0);
  }
  const day_increment = faker.finance.amount(0, 20, 0);
  homes = homes.concat(`${host_first_name},${host_last_name},${host_email},${cleaning_fee},
  ${service_fee},${rating},${reviews},${max_guests},${base_price},${guest_increment},${day_increment}\n`);
  if (i === 99) {
    homes = homes.substring(0, homes.length - 1);
  }
  // generate 10,000,000 users
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  const email = faker.internet.email();
  users = users.concat(`${first_name},${last_name},${email}\n`);
  // generate 10 reservations per home (100,000,000)
  let current = 0;
  for (let j = 0; j < 10; j++) {
    const adults = faker.finace.amount(0, max_guests, 0);
    const children = faker.finace.amount(0, max_guests - adults, 0);
    const infants = faker.finance.amount(0, 2, 0);
    const guestCost = guest_increment * (adult + children);
    const dayCost = ((end_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24)) * day_increment;
    const cost = base_price + service_fee + guestCost + dayCost;
    if (current === 0) {
      const start_date = faker.date.between('2019-12-01', '2019-12-31');
      const end_date = faker.date.between(start_date, '2019-12-31'); 
      current = end_date;
    } else {
      if (j !== 10) {
        const start_date = faker.date.between(current, `2019-0${j}-29`);
        const end_date = faker.date.between(start_date, `2019-${j}-29`);
        current = end_date;
      } else {
        const start_date = faker.date.between(current, `2019-${j}-31`)
        const end_date = faker.date.between(start_date, `2019-${j}-31`)
      }
    }
    const randomUser = faker.finance.amount(1, 100, 0);
    reservations = reservations.concat(`${start_date},${end_date},${adults},${children},${infants},${cost},${i},${randomUser}`)
  }
}

fs.writeFile(path.join(__dirname, 'homes.csv'), homes, (err) => {
  if (err) {
    console.log('error writing homes csv file');
  } else {
    console.log('successfully written homes csv file');
  }
}).then(() => {
  client.connect();
  const homesPath = path.join(__dirname, 'homes.csv');
  client.query(`\COPY homes(host_first_name,host_last_name,host_email,cleaning_fee,service_fee,rating,
    reviews,max_guests,base_price,guest_increment,day_increment) FROM '/tmp/homes.csv' DELIMITER ',';`, (err) => {
    if (err) {
      console.log(`error copying to homes table: ${err}`);
    } else {
      console.log(`saved into homes table`);
    }
  })
})






