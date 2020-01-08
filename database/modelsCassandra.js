const client = require('./indexCassandra.js');

client.connect();

const start = new Date();

const getHome = (id) => {
  client.execute(`SELECT * FROM reservations.home WHERE id=${id};`, (err, data) => {
    if (err) {
      console.log(`error getting home info from DB: ${err}`)
    } else {
      const getHomeEnd = new Date();
      console.log(`successful get home info from DB: ${getHomeEnd - start} ms`);
      console.log(`sample result for getHome: ${JSON.stringify(data.rows)}`);
      let result = {
        home: data.rows
      }
      client.execute(`SELECT * FROM reservations.reservation WHERE home_id=${id};` , (err, data) => {
        if (err) {
          console.log(`error getting reservations for home id #${id}: ${err}`);
        } else {
          const getReservationEnd = new Date();
          console.log(`successful get reservations info from DB: ${getReservationEnd - getHomeEnd} ms`);
          console.log(`successful getting reservations: ${JSON.stringify(data.rows)}`);
          result.reservations = data.rows;
          return result
        }
      })
    }
  })
}

// getHome(200);

// add reservation
const postReservation = (data) => {
  const { start, end, adults, children, infants, cost, homeId, userId } = data;
  client.execute(`INSERT INTO reservations.reservation(home_id,start,end,adults,children,infants,cost,user_id) VALUES (${homeId},'${start}','${end}',${adults},${children},${infants},${cost},${userId});`, (err) => {
    if (err) {
      console.log(`error posting from DB: ${err}`);
    } else {
      const postEnd = new Date();
      console.log(`successful post from DB: ${postEnd - start} ms`);
    }
  })
};
// INSERT INTO reservations.reservation(home_id,start,end,adults,children,infants,cost,user_id) VALUES (200,'2020-09-24','2020-09-27',2,0,0,222,122);
const samplePost = {
  start: '2020-09-24',
  end: '2020-09-27',
  adults: 2,
  children: 0,
  infants: 0,
  cost: 222,
  homeId: 200,
  userId: 122
};

// postReservation(samplePost);

// update reservation with reservation_id
// const updateReservation = (data) => {
//   const { id, start, end, adults, children, infants, cost } = data;
//   client.execute(`UPDATE reservations.reservation SET start=${start},end=${end},adults=${adults},children=${children},infants=${infants},cost=${cost} WHERE home_id=${id}`, (err) => {
//     if (err) {
//       console.log(`error updating to DB: ${err}`)
//     } else {
//       const updateEnd = new Date();
//       console.log(`successful update to DB: ${updateEnd - start} ms`);
//     }
//   })
// };
// UPDATE reservations.reservation SET start='2020-09-28',end='2020-09-30',adults=3,children=0,infants=0,cost=237 WHERE home_id=100000001
// const sampleUpdate = {
//   id: 100000001,
//   start: '2020-09-28',
//   end: '2020-09-30',
//   adults: 3,
//   children: 0,
//   infants: 0,
//   cost: 237,
//   homeId: 200,
//   userId: 122
// };

// updateReservation(sampleUpdate);

// delete reservation with given reservation_id
const deleteReservation = (data) => {
  const { homeId, start } = data;
  client.execute(`DELETE FROM reservations.reservation WHERE home_id=${id} AND start='${start}`, (err) => {
    if (err) {
      console.log(`error deleting reservation id #${id} from DB: ${err}`)
    } else {
      const deleteEnd = new Date();
      console.log(`successful delete to DB: ${deleteEnd - start} ms`);
    }
  })
};
// DELETE FROM reservations.reservation WHERE home_id=200 AND start='2020-09-24';
// deleteReservation(100000001);