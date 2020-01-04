const client = require('./indexPostgres.js');

client.connect();
const start = new Date();

// get home information and all reservations, join home with reservations home_id
const getHome = (id) => {
  client.query(`SELECT * FROM homes JOIN reservations ON homes.id = reservations.homes_id WHERE homes.id=${id};`, (err, data) => {
    if (err) {
      console.log(`error getting from DB: ${err}`);f
    } else {
      const getEnd = new Date();
      console.log(`successful get from DB: ${getEnd - start} ms`);
      console.log(`sample result for getHome: ${JSON.stringify(data.rows)}`)
      return data;
    }
  });
};

// const getHome = (id) => {
//   client.query(`SELECT * FROM homes where homes.id=${id};`, (err, data) => {
//     if (err) {
//       console.log(`error getting home info from DB: ${err}`);
//     } else {
//       const getHomeEnd = new Date();
//       console.log(`successful get home info from DB: ${getHomeEnd - start} ms`);
//       console.log(`sample result for getHome: ${JSON.stringify(data.rows)}`);
//       let result = {
//         home: data.rows
//       }
//       client.query(`SELECT * FROM reservations where reservations.homes_id=${id};` , (err, data) => {
//         if (err) {
//           console.log(`error getting reservations for home id #${id}: ${err}`);
//         } else {
//           const getReservationEnd = new Date();
//           console.log(`successful get reservations info from DB: ${getReservationEnd - getHomeEnd} ms`);
//           console.log(`successful getting reservations: ${JSON.stringify(data.rows)}`);
//           result.reservations = data.rows;
//           return result
//         }
//       })
//     }
//   });
// };

getHome(200);

// add reservation
const postReservation = (data) => {
  const { startDate, endDate, adults, children, infants, cost, homesId, usersId } = data;
  client.query(`INSERT INTO reservations(start_date,end_date,adults,children,infants,cost,homes_id,users_id) VALUES ('${startDate}','${endDate}',${adults},${children},${infants},${cost},${homesId},${usersId});`, (err) => {
    if (err) {
      console.log(`error posting from DB: ${err}`);
    } else {
      const postEnd = new Date();
      console.log(`successful post from DB: ${postEnd - start} ms`);
    }
  })
};

const samplePost = {
  startDate: '2020-09-24T00:15:17-07:00',
  endDate: '2020-09-27T01:47:41-07:00',
  adults: 2,
  children: 0,
  infants: 0,
  cost: 222,
  homesId: 200,
  usersId: 122
};

// postReservation(samplePost);

// update reservation with reservation_id
const updateReservation = (data) => {
  const { id, startDate, endDate, adults, children, infants, cost } = data;
  client.query(`UPDATE reservations SET start_date=${startDate},end_date=${endDate},adults=${adults},children=${children},infants=${infants},cost=${cost} WHERE reservations.id=${id}`, (err) => {
    if (err) {
      console.log(`error updating to DB: ${err}`)
    } else {
      const updateEnd = new Date();
      console.log(`successful update to DB: ${updateEnd - start} ms`);
    }
  })
};

const sampleUpdate = {
  id: 100000001,
  startDate: '2020-09-24T00:15:17-07:00',
  endDate: '2020-09-27T01:47:41-07:00',
  adults: 3,
  children: 0,
  infants: 0,
  cost: 237,
  homesId: 200,
  usersId: 122
};

// updateReservation(sampleUpdate);

// delete reservation with given reservation_id
const deleteReservation = (id) => {
  client.query(`DELETE FROM reservations WHERE id=${id}`, (err) => {
    if (err) {
      console.log(`error deleting reservation id #${id} from DB: ${err}`)
    } else {
      const deleteEnd = new Date();
      console.log(`successful delete to DB: ${deleteEnd - start} ms`);
    }
  })
};

// deleteReservation(100000001);