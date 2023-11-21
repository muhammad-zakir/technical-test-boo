'use strict';

const express = require('express');
const application = express();

// set the view engine to ejs
application.set('view engine', 'ejs');

// routes
application.use('/', require('./routes/profile')());
application.use('/comment', require('./routes/comment')());

module.exports = application;
