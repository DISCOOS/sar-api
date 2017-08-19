'use strict';

module.exports = function(app) {

  return;

  // Session
  let cookieParser = require('cookie-parser');
  let session = require('express-session');

  // Override with cookie secret fetched from client request
  app.middleware('session:before', cookieParser(process.env.COOKIE_SECRET));

  // Override secret in middleware.json
  app.middleware('session', session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  }));

};
