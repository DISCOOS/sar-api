'use strict';

let path = require('path');
let fileName = path.basename(__filename, '.js');
let debug = require('debug')('sar:status:'+fileName);

module.exports = function(app) {

  return;

  debug('Seeding database');
  let SARUser = app.models.SARUser;

  let newUser = {};
  newUser.email = 'demo@kova.no';
  newUser.username = 'demo@kova.no';
  newUser.password = SARUser.hashPassword('12345678');
  newUser.kovaId = 1;
  newUser.name = 'Demo Demo';
  newUser.isAvailable = true;
  newUser.isTrackable = true;
  newUser.isAdmin = true;
  newUser.emailVerified = true;

  SARUser.create(newUser, function(err, user) {
    if (err) {
      debug('Failed to create user, ' + err);
    } else {
      debug('Created user ' + user);
    }
  });
};
