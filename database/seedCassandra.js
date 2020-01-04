const faker = require('faker');
const fs = require('fs');
const path = require('path');
const Moment = require('moment');
const client = require('./indexCassandra.js');

const start = new Date();
const dataLength = 10000000;
const chunks = 10;

// generate 10,000,000 users
const usersData = async (writer, encoding, callback) => {
  let i = 0;
  const write = async () => {
    let ok = true;
    do {
      i++;
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email();
      let data = `${firstName},${lastName},${email}\n`;
      if (i === dataLength/chunks) {
        data = data.substring(0, data.length - 1)
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i < dataLength/chunks && ok);
    if (i < dataLength/chunks) {
      writer.once('drain', write);
    }
  }
  await write().catch((err) => {console.log(`error writing users: ${err}`)});
};

// generate 10,000,000 homes 
const homesData = async (chunkIndex, writer, encoding, callback) => {
  let i = 0;
  let guestArr = [];
  let dayIncArr = [];
  let guestIncArr = [];
  let priceArr = [];
  let serviceArr = [];
  const write = async () => {
    let ok = true;
    do {
      i++;
      const id = i + ((chunkIndex - 1) * dataLength/chunks);
      const hostFirstName = faker.name.firstName();
      const hostLastName = faker.name.lastName();
      const hostEmail = faker.internet.email();
      const cleaningFee = Number(faker.finance.amount(10, 30, 0));
      const rating = Number(faker.finance.amount(2, 5, 2));
      const reviews = Number(faker.finance.amount(0, 500, 0));
      const basePrice = Number(faker.finance.amount(25, 250, 0));
      priceArr.push(basePrice);
      const serviceFee = Math.floor(0.4 * basePrice);
      serviceArr.push(serviceFee);
      let maxGuests = 1;
      if (basePrice < 100) {
        maxGuests = Number(faker.finance.amount(1, 3, 0));
      } else {
        maxGuests = Number(faker.finance.amount(2, 10, 0));
      }
      guestArr.push(maxGuests);
      let guestIncrement = 0;
      if (maxGuests === 1) {
        guestIncrement = 0;
      } else {
        guestIncrement = Number(faker.finance.amount(0, 20, 0));
      }
      guestIncArr.push(guestIncrement);
      const dayIncrement = Number(faker.finance.amount(0, 20, 0));
      dayIncArr.push(dayIncrement);
      let data = `${id},${hostFirstName},${hostLastName},${hostEmail},${cleaningFee},${serviceFee},${rating},${reviews},${maxGuests},${basePrice},${guestIncrement},${dayIncrement}\n`;
      if (i === dataLength/chunks) {
        data = data.substring(0, data.length - 1)
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i < dataLength/chunks && ok);
    if (i < dataLength/chunks) {
      writer.once('drain', write);
    }
  }
  await write().catch((err) => {console.log(`error writing homes csv: ${err}`)});
  const result = {};
  result.maxGuests = guestArr;
  result.guestIncrement = guestIncArr;
  result.dayIncrement = dayIncArr;
  result.basePrice = priceArr;
  result.serviceFee = serviceArr;
  return result;
};

// generate 10 reservations per home (100,000,000)

const reservationsData = async (data, chunkIndex, writer, encoding, callback) => {
  const { maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee, homesEnd } = data;
  let i = 0;
  const write = async () => {
    let ok = true;
    do {
      i++;
      const index = i - 1;
      const info = {
        index: i,
        chunkIndex: chunkIndex,
        maxGuests: maxGuests[index],
        guestIncrement: guestIncrement[index],
        dayIncrement: dayIncrement[index],
        basePrice: basePrice[index],
        serviceFee: serviceFee[index]
      };
      let data = eachReservation(info, chunkIndex);
      if (i === dataLength/chunks) {
        data = data.substring(0, data.length - 1)
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i < dataLength/chunks && ok);
    if (i < dataLength/chunks) {
      writer.once('drain', write);
    }
  };
  await write().catch((err) => {console.log(`error writing reservations csv: ${err}`)});
  return homesEnd;
}

const eachReservation = (data, chunkIndex) => {
  const { index, maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee, emails } = data;
  let reservations = '';
  let current = 0;
  for (let j = 0; j < 10; j++) { 
    let adults = 0;
    const id = index + ((chunkIndex - 1) * dataLength/chunks);
    if (maxGuests === 1) {
      adults = 1;
    } else {
      adults = Number(faker.finance.amount(1, maxGuests, 0));
    }
    let maxChildren = maxGuests - adults;
    let children = 0;
    if (maxChildren <= 0) {
      maxChildren = 0;
    } else {
      children = Number(faker.finance.amount(0, maxChildren, 0));
    }
    const infants = Number(faker.finance.amount(0, 2, 0));
    const guestCost = guestIncrement * (adults + children);
    let startDate = '';
    let endDate = '';
    const oneDay = 24 * 60 * 60 * 1000;
    if (current === 0) {
      startDate = faker.date.between('2019-12-01', '2019-12-30');
      endDate = faker.date.between(startDate, '2019-12-31');
      current = endDate;
    } else {
      while (Math.round(Math.abs((endDate - startDate) / oneDay)) === 0) {
        startDate = faker.date.between(current, `2020-0${j}-29`);
        endDate = faker.date.between(startDate, `2020-0${j}-29`);
      }
      current = endDate;
    }
    const dayCost = (Math.round(Math.abs((endDate - startDate) / oneDay))) * dayIncrement;
    const cost = basePrice + serviceFee + guestCost + dayCost;
    const randomUser = Number(faker.finance.amount(1, dataLength, 0));
    reservations = reservations.concat(`${id},${Moment(startDate).format().substring(0, 10)},${Moment(endDate).format().substring(0, 10)},${adults},${children},${infants},${cost},${randomUser}\n`);
  }
  return reservations;
}

console.log(`Sample data: ${dataLength}`);
console.log(`Total chunks: ${chunks}`);

const makeChunks = async () => {
  let current = start;
  let counter = 1;
  // client.connect();
  for (let i = 1; i <= chunks; i++) {
    let writeUsers = fs.createWriteStream(path.join(__dirname, `./users/users${i}.csv`));
    let writeHomes = fs.createWriteStream(path.join(__dirname, `./homes/homes${i}.csv`));
    let writeReservations = fs.createWriteStream(path.join(__dirname, `./reservations/reservations${i}.csv`));
    let usersEnd;
    
    await usersData(writeUsers, 'utf8', (err) => {
      if (err) {
        console.log(`error creating chunk #${i} users data: ${err}`)
      } else {
        writeUsers.end();
        usersEnd = new Date();
        console.log(`${usersEnd - current} ms to create chunk #${i} for users data`);
        current = usersEnd;
        // let seedEnd = seedUsers(users, usersEnd, i);
      }
    });
   
    const homeData = await homesData(i, writeHomes, 'utf8', (err) => {
      if (err) {
        console.log(`error creating chunk #${i} homes data: ${err}`)
      } else {
        writeHomes.end();
        const homesEnd = new Date();
        console.log(`${homesEnd - current} ms to create chunk #${i} for homes data`);
        // current = seedHomes(homes, end, i);
        current = homesEnd;
      }
    });

    const { maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee, end } = homeData;
    const result = {
      maxGuests,
      guestIncrement,
      dayIncrement,
      basePrice,
      serviceFee,
      homesEnd: end
    };

    await reservationsData(result, i, writeReservations, 'utf8', (err) => {
      if (err) {
        console.log(`error creating chunk #${i} reservations data: ${err}`)
      } else {
        writeReservations.end();
        const reservationsEnd = new Date();
        console.log(`${reservationsEnd - current} ms to write chunk #${i} for reservations data`);
        current = reservationsEnd;
        counter++;
        // current = seedReservations(reservationsEnd, i);
        if (counter === 10) {
          const endFinal = new Date();
          console.log(`Total time: ${endFinal - start}`);
        }
      }
    })
  }
};

makeChunks().catch((err) => {console.log(`error making chunks: ${err}`)});


// COPY user (first_name,last_name,email) FROM './database/users/users1.csv';

// COPY home(id,host_first_name,host_last_name,host_email,cleaning_fee,service_fee,rating,reviews,max_guests,base_price,guest_increment,day_increment) FROM './database/homes/homes1.csv';

// COPY reservation (home_id,start,end,adults,children,infants,cost,user_id) FROM './database/reservations/reservations1.csv';
