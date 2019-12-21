const pg = require('pg');
const conString = "posgress://postgres:elephant@localhost:5432/reservations";
const client = new pg.Client(conString);

module.exports = client;