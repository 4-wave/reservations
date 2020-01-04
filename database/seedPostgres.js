const faker = require('faker');
const fs = require('fs');
// const util = require('util');
const path = require('path');
const Moment = require('moment');
const client = require('./indexPostgres.js');

const start = new Date();
const dataLength = 10000000;
const chunks = 10;
const tmpPath = path.resolve('/private', 'tmp');

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
const homesData = async (writer, encoding, callback) => {
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
      let data = `${hostFirstName},${hostLastName},${hostEmail},${cleaningFee},${serviceFee},${rating},${reviews},${maxGuests},${basePrice},${guestIncrement},${dayIncrement}\n`;
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
  const { index, maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee } = data;
  let reservations = '';
  let current = 0;
  for (let j = 0; j < 10; j++) { 
    let adults = 0;
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
    const randomUser = Number(faker.finance.amount(chunkIndex, chunkIndex - 1 + (dataLength/chunks), 0));
    reservations = reservations.concat(`${Moment(startDate).format()},${Moment(endDate).format()},${adults},${children},${infants},${cost},${index + ((chunkIndex - 1) * (dataLength/chunks))},${randomUser}\n`);
  }
  return reservations;
}

// const writeFile = util.promisify(fs.writeFile);
const seedUsers = async (stringEnd, index) => {
  await client.query(`\COPY users(first_name,last_name,email) FROM '/tmp/users/users${index}.csv' DELIMITER ',';`);
  const saveUsersEnd = new Date();
  console.log(`${saveUsersEnd - stringEnd} ms to save into chunk #${index} for users table`)
  return saveUsersEnd;
};

const seedHomes = async (stringEnd, index) => {
  await client.query(`\COPY homes(host_first_name,host_last_name,host_email,cleaning_fee,service_fee,rating,reviews,max_guests,base_price,guest_increment,day_increment) FROM '/tmp/homes/homes${index}.csv' DELIMITER ',';`);
  const saveHomesEnd = new Date();
  console.log(`${saveHomesEnd - stringEnd} ms to save into chunk #${index} for homes table`);
  return saveHomesEnd;
};

const seedReservations = async (stringEnd, index) => {
  await client.query(`\COPY reservations(start_date,end_date,adults,children,infants,cost,homes_id,users_id) FROM '/tmp/reservations/reservations${index}.csv' DELIMITER ',';`);
  const saveReservationsEnd = new Date();
  console.log(`${saveReservationsEnd - stringEnd} ms to save into chunk #${index} into reservations table`);
  return saveReservationsEnd;
};

const makeChunks = async () => {
  let current = start;
  let counter = 1;
  client.connect();
  for (let i = 1; i <= chunks; i++) {
    let writeUsers = fs.createWriteStream(`${tmpPath}/users/users${i}.csv`);
    let writeHomes = fs.createWriteStream(`${tmpPath}/homes/homes${i}.csv`);
    let writeReservations = fs.createWriteStream(`${tmpPath}/reservations/reservations${i}.csv`);

    await usersData(writeUsers, 'utf8', (err) => {
      if (err) {
        console.log(`error creating chunk #${i} users data: ${err}`)
      } else {
        writeUsers.end();
        let usersEnd = new Date();
        console.log(`${usersEnd - current} ms to create chunk #${i} for users data`);
        current = seedUsers(usersEnd, i);
      }
    });
    
    const homeData = await homesData(writeHomes, 'utf8', (err) => {
      if (err) {
        console.log(`error creating chunk #${i} homes data: ${err}`)
      } else {
        writeHomes.end();
        let homesEnd = new Date();
        console.log(`${homesEnd - current} ms to create chunk #${i} for homes data`);
        current = seedHomes(homesEnd, i);
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
        current = seedReservations(reservationsEnd, i);
        if (counter === 10) {
          const endFinal = new Date();
          console.log(`Total time: ${endFinal - start}`);
        }
      }
    })
  }
};

console.log(`Sample data: ${dataLength}`);
console.log(`Total chunks: ${chunks}`);

makeChunks().catch((err) => {console.log(`error making chunks: ${err}`)});


// const usersData = () => {
//   let users = '';
//   for (let i = 1; i <= dataLength / chunks; i++) {
//     const firstName = faker.name.firstName();
//     const lastName = faker.name.lastName();
//     const email = faker.internet.email();
//     users = users.concat(`${firstName},${lastName},${email}\n`);
//   }
//   users = users.substring(0, users.length - 1);
//   return users;
// };

// // generate 10,000,000 homes 
// const homesData = (usersEnd) => {
//   let homes = '';
//   let guestArr = [];
//   let dayIncArr = [];
//   let guestIncArr = [];
//   let priceArr = [];
//   let serviceArr = [];
//   for (let i = 1; i <= dataLength / chunks; i++) {
//     const hostFirstName = faker.name.firstName();
//     const hostLastName = faker.name.lastName();
//     const hostEmail = faker.internet.email();
//     const cleaningFee = Number(faker.finance.amount(10, 30, 0));
//     const rating = Number(faker.finance.amount(2, 5, 2));
//     const reviews = Number(faker.finance.amount(0, 500, 0));
//     const basePrice = Number(faker.finance.amount(25, 250, 0));
//     priceArr.push(basePrice);
//     const serviceFee = Math.floor(0.4 * basePrice);
//     serviceArr.push(serviceFee);
//     let maxGuests = 1;
//     if (basePrice < 100) {
//       maxGuests = Number(faker.finance.amount(1, 3, 0));
//     } else {
//       maxGuests = Number(faker.finance.amount(2, 10, 0));
//     }
//     guestArr.push(maxGuests);
//     let guestIncrement = 0;
//     if (maxGuests === 1) {
//       guestIncrement = 0;
//     } else {
//       guestIncrement = Number(faker.finance.amount(0, 20, 0));
//     }
//     guestIncArr.push(guestIncrement);
//     const dayIncrement = Number(faker.finance.amount(0, 20, 0));
//     dayIncArr.push(dayIncrement);
//     homes = homes.concat(`${hostFirstName},${hostLastName},${hostEmail},${cleaningFee},${serviceFee},${rating},${reviews},${maxGuests},${basePrice},${guestIncrement},${dayIncrement}\n`);
//   }
//   const result = {};
//   homes = homes.substring(0, homes.length - 1);
//   result.homes = homes;
//   result.maxGuests = guestArr;
//   result.guestIncrement = guestIncArr;
//   result.dayIncrement = dayIncArr;
//   result.basePrice = priceArr;
//   result.serviceFee = serviceArr;
//   result.usersEnd = usersEnd;
//   return result;
// };

// // generate 10 reservations per home (100,000,000)

// const reservationsData = async (data, chunkIndex, writer, encoding, callback) => {
//   const { maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee, homesEnd } = data;
//   let i = 0;
//   const write = async () => {
//     let ok = true;
//     do {
//       i++;
//       const index = i - 1;
//       const info = {
//         index: i,
//         maxGuests: maxGuests[index],
//         guestIncrement: guestIncrement[index],
//         dayIncrement: dayIncrement[index],
//         basePrice: basePrice[index],
//         serviceFee: serviceFee[index]
//       };
//       let data = eachReservation(info, chunkIndex);
//       if (i === dataLength/chunks) {
//         data = data.substring(0, data.length - 1)
//         writer.write(data, encoding, callback);
//       } else {
//         ok = writer.write(data, encoding);
//       }
//     } while (i <= dataLength/chunks && ok);
//     if (i <= dataLength) {
//       writer.once('drain', write);
//     }
//   };
//   await write().catch((err) => {console.log(`error writing reservations csv: ${err}`)});
//   return homesEnd;
// }

// // const reservationsData = async (data) => {
// //   const { maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee, homesEnd } = data;
// //   let reservations = '';
// //   for (let i = 0; i < dataLength / chunks; i++) {
// //     const info = {
// //       index: i + 1,
// //       maxGuests: maxGuests[i],
// //       guestIncrement: guestIncrement[i],
// //       dayIncrement: dayIncrement[i],
// //       basePrice: basePrice[i],
// //       serviceFee: serviceFee[i]
// //     };
// //     reservations = reservations.concat(`${await eachReservation(info)
// //       .then((data) => {
// //       return data;
// //       })
// //       .catch((err) => {console.log(`error creating each reservation: ${err}`)})}`);
// //   }
// //   const result = {};
// //   reservations = reservations.substring(0, reservations.length - 1);
// //   result.reservations = reservations;
// //   result.homesEnd = homesEnd;
// //   return result;
// // };

// const eachReservation = (data, chunkIndex) => {
//   const { index, maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee } = data;
//   let reservations = '';
//   let current = 0;
//   for (let j = 0; j < 10; j++) { 
//     let adults = 0;
//     if (maxGuests === 1) {
//       adults = 1;
//     } else {
//       adults = Number(faker.finance.amount(1, maxGuests, 0));
//     }
//     let maxChildren = maxGuests - adults;
//     let children = 0;
//     if (maxChildren <= 0) {
//       maxChildren = 0;
//     } else {
//       children = Number(faker.finance.amount(0, maxChildren, 0));
//     }
//     const infants = Number(faker.finance.amount(0, 2, 0));
//     const guestCost = guestIncrement * (adults + children);
//     let startDate = '';
//     let endDate = '';
//     const oneDay = 24 * 60 * 60 * 1000;
//     if (current === 0) {
//       startDate = faker.date.between('2019-12-01', '2019-12-30');
//       endDate = faker.date.between(startDate, '2019-12-31');
//       current = endDate;
//     } else {
//       while (Math.round(Math.abs((endDate - startDate) / oneDay)) === 0) {
//         startDate = faker.date.between(current, `2020-0${j}-29`);
//         endDate = faker.date.between(startDate, `2020-0${j}-29`);
//       }
//       current = endDate;
//     }
//     const dayCost = (Math.round(Math.abs((endDate - startDate) / oneDay))) * dayIncrement;
//     const cost = basePrice + serviceFee + guestCost + dayCost;
//     const randomUser = Number(faker.finance.amount(chunkIndex, chunkIndex - 1 + (dataLength/chunks), 0));
//     reservations = reservations.concat(`${Moment(startDate).format()},${Moment(endDate).format()},${adults},${children},${infants},${cost},${index + ((chunkIndex - 1) * (dataLength/chunks))},${randomUser}\n`);
//     // if (j === 9) {
//     //   reservations = reservations.substring(0, reservations.length - 1);
//     // }
//   }
//   return reservations;
// }

// const makeChunks = async () => {
  //   let current = start;
  //   client.connect();
  //   for (let i = 1; i <= chunks; i++) {
    //     let writeReservations = fs.createWriteStream(`${tmpPath}/reservations${i}.csv`);
    //     const users = usersData();
    //     const usersEnd = new Date();
    //     console.log(`${usersEnd - current} ms to create chunk #${i} for users data`)
    //     let seedEnd = seedUsers(users, usersEnd, i);
    
    //     const homeData = homesData(seedEnd);
    //     const { maxGuests, guestIncrement, dayIncrement, basePrice, serviceFee, homes, end } = homeData;
    //     const homesEnd = new Date();
    //     console.log(`${homesEnd - seedEnd} ms to create chunk #${i} for homes data`);
    //     current = seedHomes(homes, seedEnd, i);
    //     const result = {
      //       maxGuests,
      //       guestIncrement,
      //       dayIncrement,
      //       basePrice,
      //       serviceFee,
      //       homesEnd: end
      //     };
      
      //     await reservationsData(result, i, writeReservations, 'utf8', (err) => {
        //       if (err) {
          //         console.log(`error creating chunk #${i} reservations data: ${err}`)
//       } else {
  //         writeReservations.end();
  //         const reservationsEnd = new Date();
  //         console.log(`${reservationsEnd - current} ms to write chunk #${i} for reservations data`);
  //         current = seedReservations(reservationsEnd, i);
  //         if (i === chunks) {
    //           const endFinal = new Date();
    //           console.log(`Total time: ${endFinal - start}`)
    //         }
    //       }
    //     })
    //   }
// };

// makeChunks().catch((err) => {console.log(`error making chunks: ${err}`)});


// const seed = async (homes, users, reservations, stringEnd) => {
//   const tmpPath = path.resolve('/private', 'tmp');
//   await writeFile(`${tmpPath}/homes.csv`, homes);
//   const writeHomesEnd = new Date();
//   console.log(`${writeHomesEnd - stringEnd} ms to write homes csv`);

//   await writeFile(`${tmpPath}/users.csv`, users);
//   const writeUsersEnd = new Date();
//   console.log(`${writeUsersEnd - writeHomesEnd} ms to write users csv`);

//   await writeFile(`${tmpPath}/reservations.csv`, reservations);
//   const writeReservationsEnd = new Date();
//   console.log(`${writeReservationsEnd - writeUsersEnd} ms to write reservations csv`);

//   client.connect();
//   await client.query(`\COPY homes(host_first_name,host_last_name,host_email,cleaning_fee,service_fee,rating,reviews,max_guests,base_price,guest_increment,day_increment) FROM '/tmp/homes.csv' DELIMITER ',';`);
//   const saveHomesEnd = new Date();
//   console.log(`${saveHomesEnd - writeReservationsEnd} ms to save into homes table`)

//   await client.query(`\COPY users(first_name,last_name,email) FROM '/tmp/users.csv' DELIMITER ',';`);
//   const saveUsersEnd = new Date();
//   console.log(`${saveUsersEnd - saveHomesEnd} ms to save into users table`)

//   await client.query(`\COPY reservations(start_date,end_date,adults,children,infants,cost,homes_id,users_id) FROM '/tmp/reservations.csv' DELIMITER ',';`);
//   const saveReservationsEnd = new Date();
//   console.log(`${saveReservationsEnd - saveUsersEnd} ms to save into reservations table`)
// };

// const seed = async (homes, users, reservations, dataEnd) => {
//   console.log('start writing homes')
//   const tmpPath = path.resolve('/private', 'tmp');
//   fs.writeFile(`${tmpPath}/homes.csv`, homes)
//     .then(() => {
//       const writeHomesEnd = new Date();
//       console.log(`${writeHomesEnd - dataEnd} ms to write homes csv`)
//       fs.writeFile(`${tmpPath}/users.csv`, users)
//       return writeHomesEnd;
//     })
//     .then((data) => {
//       const writeUsersEnd = new Date();
//       console.log(`${writeUsersEnd - data} ms to write users csv`)
//       fs.writeFile(`${tmpPath}/reservations.csv`, reservations)
//       return writeUsersEnd;
//     })
//     .then((data) => {
//       const writeReservationsEnd = new Date();
//       console.log(`${writeReservationsEnd - data} ms to write reservations csv`)
//       client.connect();
//       client.query(`\COPY homes(host_first_name,host_last_name,host_email,cleaning_fee,service_fee,rating,reviews,max_guests,base_price,guest_increment,day_increment) FROM '/tmp/homes.csv' DELIMITER ',';`);
//       return writeReservationsEnd;
//     })
//     .then((data) => {
//       const saveHomesEnd = new Date();
//       console.log(`${saveHomesEnd - data} ms to save into homes table`)
//       client.query(`\COPY users(first_name,last_name,email) FROM '/tmp/users.csv' DELIMITER ',';`);
//       return saveHomesEnd;
//     })
//     .then((data) => {
//       const saveUsersEnd = new Date();
//       console.log(`${saveUsersEnd - data} ms to save into users table`)
//       client.query(`\COPY reservations(start_date,end_date,adults,children,infants,cost,homes_id,users_id) FROM '/tmp/reservations.csv' DELIMITER ',';`);
//       return saveUsersEnd;
//     })
//     .then((data) => {
//       const saveReservationsEnd = new Date();
//       console.log(`${saveReservationsEnd - data} ms to save into reservations table`)
//     })
//     .catch((err) => {console.log(`error writing csv file, ${err}`)})
// }