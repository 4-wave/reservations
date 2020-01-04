const Cassandra = require('cassandra-driver');

const client = new Cassandra.Client({ 
  contactPoints: '127.0.0.1:9042',
  keyspace: 'reservations',
  localDataCenter: 'datacenter1'
});

module.exports = client;