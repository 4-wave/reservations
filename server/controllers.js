const models = require('../database/modelsPostgres.js');

module.exports = {
  getHome: (req, res) => {
    models.getHome(req.params.id, (err, data) => {
      if (err) {
        console.log(`error getting home info to server: ${err}`)
        res.sendStatus(400);
      } else {
        console.log(`successful get for home info to server`)
        res.status(200).send(data);
      }
    })
  },
  getReservations: (req, res) => {
    models.getReservations(req.params.id, (err, data) => {
      if (err) {
        console.log(`error getting reservations to server: ${err}`)
        res.sendStatus(400);
      } else {
        console.log(`successful get for reservations to server`)
        res.status(200).send(data);
      }
    })
  },
  postReservation: (req, res) => {
    models.postReservation(req.body, (err) => {
      if (err) {
        console.log(`error posting reservation: ${err}`);
      } else {
        console.log(`successful post`);
        res.sendStatus(200);
      }
    })
  },
  updateReservation: (req, res) => {
    models.updateReservation(req.body, (err) => {
      if (err) {
        console.log(`error updating reservation: ${err}`)
      } else {
        console.log(`successful update`);
        res.sendStatus(200);
      }
    })
  },
  deleteReservation: (req, res) => {
    models.deleteReservation(req.body, (err) => {
      if (err) {
        console.log(`error deleting reservation: ${err}`)
      } else {
        console.log(`sucessful delete`);
        res.sendStatus(200)
      }
    })
  }
};
