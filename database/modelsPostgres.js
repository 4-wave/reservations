const client = require('../database/indexPostgres.js');

client.connect();
let counter = 0;
module.exports = {
  getHome: (id, callback) => {
    const start = new Date();
    client.query(`SELECT * FROM homes WHERE homes.id=${id};`, (err, data) => {
      //SELECT * FROM homes JOIN reservations ON homes.id = reservations.homes_id WHERE homes.id=${id};
      if (err) {
        console.log(`error getting from DB: ${err}`);
        callback(err, null);
      } else {
        const getEnd = new Date();
        console.log(`successful get from DB: ${getEnd - start} ms`);
        // console.log(`sample result for getHome: ${JSON.stringify(data.rows)}`)
        callback(null, data.rows);
      }
    });
  },
  getReservations: (id, callback) => {
    const start = new Date();
    client.query(`SELECT * FROM reservations WHERE reservations.homes_id=${id};`, (err, data) => {
      if (err) {
        console.log(`error getting from DB: ${err}`);
        callback(err, null);
      } else {
        const getEnd = new Date();
        console.log(`successful get from DB: ${getEnd - start} ms`);
        // console.log(`sample result for getHome: ${JSON.stringify(data.rows)}`)
        callback(null, data.rows);
      }
    });
  },
  postReservation: (data, callback) => {
    const start = new Date();
    data = {
      startDate: '2020-09-24T00:15:17-07:00',
      endDate: '2020-09-27T01:47:41-07:00',
      adults: 2,
      children: 0,
      infants: 0,
      cost: 222,
      homesId: 200,
      usersId: 122
    }
    const { startDate, endDate, adults, children, infants, cost, homesId, usersId } = data;
    counter++;
    client.query(`INSERT INTO reservations(start_date,end_date,adults,children,infants,cost,homes_id,users_id) VALUES ('${startDate}','${endDate}',${adults},${children},${infants},${cost},${homesId},${usersId});`, (err) => {
      if (err) {
        console.log(`error posting from DB: ${err}`);
        callback(err)
      } else {
        const postEnd = new Date();
        console.log(`successful post from DB: ${postEnd - start} ms`);
        callback(null);
      }
    })
  },
  updateReservation: (data, callback) => {
    const start = new Date();
    const { id, startDate, endDate, adults, children, infants, cost } = data;
    client.query(`UPDATE reservations SET start_date=${startDate},end_date=${endDate},adults=${adults},children=${children},infants=${infants},cost=${cost} WHERE reservations.id=${id}`, (err) => {
      if (err) {
        console.log(`error updating to DB: ${err}`)
        callback(err);
      } else {
        const updateEnd = new Date();
        console.log(`successful update to DB: ${updateEnd - start} ms`);
        callback(null);
      }
    })
  },
  deleteReservation: (id) => {
    client.query(`DELETE FROM reservations WHERE id=${id}`, (err) => {
      if (err) {
        console.log(`error deleting reservation id #${id} from DB: ${err}`);
        callback(err);
      } else {
        const deleteEnd = new Date();
        console.log(`successful delete to DB: ${deleteEnd - start} ms`);
        callback(null);
      }
    })
  }
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