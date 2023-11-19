'use strict';

const express = require('express');
const router = express.Router();

function isProfileBodyValid(requestBody) {
  const {
    name,
    description,
    mbti,
    enneagram,
    variant,
    tritype,
    socionics,
    sloan,
    psyche
  } = requestBody;

  return name && description && mbti &&  enneagram &&  variant && tritype && socionics && sloan && psyche;
}

module.exports = function() {
  router.get('/:userIdentifier(\\d+)', async function(request, response, next) {
    const { userIdentifier } = request.params;

    await request.app.get('databaseConnection').connect();
    const database = request.app.get('databaseConnection').db('');
    const profiles = database.collection('profiles');
    const profile = await profiles.findOne({ _id: Number(userIdentifier) });

    if (profile === null) {
      response.status(404).send("Sorry, the profile that you're looking for can't be found.")
    }

    response.render('profile_template', {
      profile: profile,
    });
  });

  router.post('/', express.json(), async (request, response) => {
    if (isProfileBodyValid(request.body) ) {
      const { name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche } = request.body;

      await request.app.get('databaseConnection').connect();
      const database = request.app.get('databaseConnection').db('');

      const profiles = database.collection('profiles');

      const profile = {
        _id: await profiles.estimatedDocumentCount() + 1,
        name: name,
        description: description,
        mbti: mbti,
        enneagram: enneagram,
        variant: variant,
        tritype: tritype,
        socionics: socionics,
        sloan: sloan,
        psyche: psyche,
        image: "https://soulverse.boo.world/images/1.png"
      };

      profiles.insertOne(profile);
      response.json(profile)
    } else {
      response.status(422).json({
        message: 'Please validate the profile data first.'
      });
    }
  });

  return router;
}

