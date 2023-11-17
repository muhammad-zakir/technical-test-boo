'use strict';

const express = require('express');
const app = express();
const port =  process.env.PORT || 3000;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

MongoMemoryServer.create()
    .then(async function(mongoServer)  {
      // set the database's connection uri
      app.set('databaseConnection', new MongoClient(mongoServer.getUri()));

      // seed the initial profiles
      await app.get('databaseConnection').connect();
      const database = app.get('databaseConnection').db('');
      const profiles = database.collection('profiles');
      await profiles.insertMany([
        {
          "_id": 1,
          "name": "A Martinez",
          "description": "Adolph Larrue Martinez III.",
          "mbti": "ISFJ",
          "enneagram": "9w3",
          "variant": "sp/so",
          "tritype": 725,
          "socionics": "SEE",
          "sloan": "RCOEN",
          "psyche": "FEVL",
          "image": "https://soulverse.boo.world/images/1.png",
        },
        {
          "_id": 2,
          "name": "Superion Blowpipe",
          "description": "An Autobot from Earth, with an Fe- blood type.",
          "mbti": "ISTJ",
          "enneagram": "3w2",
          "variant": "sp/so",
          "tritype": 725,
          "socionics": "SEE",
          "sloan": "RCOEN",
          "psyche": "FEVL",
          "image": "https://soulverse.boo.world/images/1.png",
        },
        {
          "_id": 3,
          "name": "Rumble Ramjet",
          "description": "An Autobot from Cybertron, with an Au- blood type.",
          "mbti": "INFP",
          "enneagram": "2w3",
          "variant": "sp/so",
          "tritype": 725,
          "socionics": "SEE",
          "sloan": "RCOEN",
          "psyche": "FEVL",
          "image": "https://soulverse.boo.world/images/1.png",
        }
      ]);

      // set the view engine to ejs
      app.set('view engine', 'ejs');

      // routes
      app.use('/', require('./routes/profile')());

      // start server
      const server = app.listen(port);
      console.log('Express started. Listening on %s', port);
    })
    .catch(error => { console.log(error) });
