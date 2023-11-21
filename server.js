//server.js
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { initialProfilesSeeder } = require('./utilities/initialProfilesSeeder');
const application = require('./application');
const port =  process.env.PORT || 3000;

MongoMemoryServer.create().then(async function(mongoServer)  {
  // set the database's connection uri
  const databaseConnection = new MongoClient(mongoServer.getUri());
  await databaseConnection.connect();
  const database = databaseConnection.db('');
  application.set('database', database);

  // seed the initial profiles
  await initialProfilesSeeder(database);
});

application.listen(port, () => {
  console.log('Express started. Listening on %s', port);
});