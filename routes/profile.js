'use strict';

const express = require('express');
const router = express.Router();
const { createProfileHandler } = require('../handlers/createProfile');
const { fetchProfileHandler } = require('../handlers/fetchProfile');

module.exports = function() {
  router.get('/', function (request, response) {
    response.redirect('/1');
  });

  router.get('/:userIdentifier(\\d+)', async function(request, response, next) {
    await fetchProfileHandler(request, response);
  });

  router.post('/', express.json(), async (request, response) => {
    await createProfileHandler(request, response);
  });

  return router;
}

