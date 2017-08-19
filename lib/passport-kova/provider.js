'use strict';

/**
 * Module dependencies.
 */

let _ = require('underscore');

// Use same random generator as loopback
let Utils = require('./utils');

// Enable internationalization and localization
const SG = require('strong-globalize');
const g = SG();

// Reuse strategy from passport-local
let Strategy = require('passport-local').Strategy;

// Enable debug
let path = require('path');
let fileName = path.basename(__filename, '.js');
let debug = require('debug')('sar:status:'+fileName);

/**
 * Module exports.
 */

module.exports = KovaProvider;


/**
 * The kova configurator
 * @param {Object} app The LoopBack app instance
 * @returns {KovaProvider}
 * @constructor
 * @class
 */
function KovaProvider(app) {
  if (!(this instanceof KovaProvider)) {
    return new KovaProvider(app);
  }
  this.app = app;

  // Get access token from kova from credentials
  this.authenticate = function (req, username, password, done) {

    // First make request to kova
    app.models.kova.token(username, password)
      .then((response) => {
        done(null, response);
      })
      .catch((err) => {
        done(err, null);
      });
  };

  // Callback for converting profile to user properties
  this.profileToUser = function(provider, profile) {
    let password = Utils.generateKey('password');
    return {
      realm: provider,
      name: profile.name,
      username: profile.username,
      email: profile.email || profile.username,
      password: password,
      isAdmin: false,
      isAvailable: false,
      isTrackable: false,
      emailVerified: true
    };
  };

  /*!
   * Create an access token for the given user
   * @param {Object} req The request object
   * @param {User} user The user instance
   * @param {Number} [ttl] The ttl in millisenconds
   * @callback {Function} done The callback function called after token is created and persisted
   * @param {Error|String} err The error object
   * @param {SARAccessToken} token The access token just created
   */
  this.createAccessToken = function(req, user, ttl, done) {
    if (arguments.length === 2 && typeof ttl === 'function') {
      done = ttl;
      ttl = 0;
    }
    var ip = req.id || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let settings = user.constructor.settings;
    user.accessTokens.create({
      created: new Date(),
      ttl: Math.min(ttl || settings.ttl, settings.maxTTL),
      referrer: ip
    }, done);
  }

  /*!
   * Callback passed to UserIdentity.login
   * @param {object} req The client request
   * @param {object} res Kova response
   * @callback {Function} done The callback function called after login callback is complete
   * @param {Error|String} err The error object
   * @param {object} authInfo The authentication info
   */
  this.loginCallback = function(req, res, done) {
    let self = this;
    return function(err, user, identity) {
      let authInfo = {
        identity: identity,
      };

      // Create loopback access token for given looback use
      self.createAccessToken(req, user, res.expires_in, function(err, token) {
        if (token) {
          authInfo.accessToken = token;
        }
        done(err, user, authInfo);
      });

    };
  };



}


/**
 * Configure a passport strategy for kova authentication provider.
 * @param {Object} passport The passport instance
 * @param {Object} configurator The passport configurator instance for loopback
 * @options {Object} Options for the kova authentication provider.
 * @property {String} [usernameField] The field name for kova username.
 * @property {String} [passwordField] The field name for kova password.
 * @return {Object} Options used
 * @end
 */
KovaProvider.prototype.configure = function(passport, configurator, options) {
  options = options || {};
  options = _.defaults({
    usernameField: options.usernameField || 'username',
    passwordField: options.passwordField || 'password',
    session: false,
    authInfo: true,
    autoLogin: false,
    passReqToCallback: true,
    profileToUser: this.profileToUser,

  }, options);

  const self = this,
    authScheme = 'kova',
    provider = 'kova';

  const strategy = new Strategy(options,

    // Invoked by strategy after validating credentials
    function (req, username, password, done) {

      // Forward credentials to kova
      self.authenticate(req, username, password,

        // Invoked after response from kova
        function(err, res) {

          let token = res.access_token;

          let profile = {
            'realm': provider,
            'username': username,
            'email': username,
            'name': res.user.name,
            'id': res.user.personRef
          };

          // Login loopback user with identity authenticated and resolved from kova
          configurator.userIdentityModel.login(
            provider, authScheme, profile,
            {token: token}, options,
            self.loginCallback(req, res, done));
        })
    }
  );

  passport.use(provider, strategy);

  return options;

};
