'use strict';

const express = require('express');
const router = express.Router();
const { createCommentHandler } = require('../handlers/createComment');
const { fetchCommentsHandler } = require('../handlers/fetchComments');
const { likeCommentHandler } = require('../handlers/likeComment');

module.exports = function() {
  router.get('/:profileIdentifier(\\d+)', express.json(), async (request, response) => {
    await fetchCommentsHandler(request, response);
  });
  
  router.post('/', express.json(), async (request, response) => {
    await createCommentHandler(request, response);
  });
  
  router.post('/like', express.json(), async (request, response) => {
    await likeCommentHandler(request, response);
  });

  return router;
}

