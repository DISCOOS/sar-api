'use strict';

// Enable debug
let path = require('path');
let fileName = path.basename(__filename, '.js');
let debug = require('debug')('sar:status:'+fileName);

module.exports = function enableAuthentication(app) {

  // Enable authentication
  app.enableAuth({ datasource: 'db' });

  // Initialize Passport configurator
  let loopbackPassport = require('loopback-component-passport');
  let PassportConfigurator = loopbackPassport.PassportConfigurator;
  let passportConfigurator = new PassportConfigurator(app);

  // Configure passport with custom user models
  let passport = passportConfigurator.init(true);
  passportConfigurator.setupModels({
    userModel: app.models.SARUser,
    userIdentityModel: app.models.SARUserIdentity,
    userCredentialModel: app.models.SARUserCredential,
  });


  // Configure passport provider for api.kova.io
  let kova = new require('passport-kova')(app);
  let config = kova.configure(passport, passportConfigurator);
  let providers = {"kova" : config };

  // Enable cookies for authentication
  let loopback = app.loopback;
  let cookieParser = require('cookie-parser');
  app.middleware('session:before', cookieParser(process.env.COOKIE_SECRET));
  app.use(loopback.token({
    model: app.models.accessToken,
    searchDefaultTokenKeys: false,
    cookies: ['access_token'],
    headers: ['access_token', 'X-Access-Token'],
    params: ['access_token']
  }));


  // Parses realm from request and validate it
  let toUsername = function(req) {
    return (req.body['username'] || req.query['username']);
  };

  // Parses realm from request and validate it
  let toValidRealm = function(req, providers) {
    let username = toUsername(req);
    let realm = /.*@(.*)\..*/.exec(username);

    if(!(realm || realm.length === 2 || providers[realm[1]])) {
      return false;
    }
    return realm[1];
  };

  // Configure parsing of JSON and form date in request body
  let bodyParser = require('body-parser');
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  // Register login endpoint and use email domain in username to decide which provider to use
  app.post('/login', function(req, res) {

      let realm = toValidRealm(req, providers);
      if(!realm) {
        return res.status(400).send();
      }

      debug('Realm: ' + realm);
      return passport.authenticate(realm, providers[realm])(req, res, function(err) {
        if(err) {
          debug(err);
          return res.status(500).send();
        }

        // Prepare response
        debug('User ' + JSON.stringify(req.user));
        debug('Token ' + JSON.stringify(req.authInfo.accessToken));
        let response = {
          user: req.user,
          token: req.authInfo.accessToken
        };

        // Add cookie to response (is this needed?)
        res.cookie(
          'access_token',
          response.token.id, {
            signed: false, // Bug: Signed cookies wont work?
            // signed: req.signedCookies ? true : false, // Can detect if client has modified cookie
            //maxAge: 10000 * remoteMethodOutput.user.expires_in,
            maxAge: 10000 * response.token.ttl,
            httpOnly: true, // Cookie cant be read by client-side javascript
            //secure: false  // Cookie cant be read by non-ssl connection
          });

        return res.json(response);
      });
    });

  app.post('/logout', function(req, res) {

    // Assumption: Unique username over all realms...
    let realm = toValidRealm(req, providers);
    if(!realm) {
      return res.status(400).send();
    }
    let username = toUsername(req);

    app.models.SARUser.findOne({where:{username:username}},
        function(err, user) {
          // remove all user tokens for given user
          app.models.SARAccessToken.destroyAll({userId: user.id},
            function(err, info, count) {
              // Prepare response
              debug('User ' + JSON.stringify(requser));
              if(err) {
                debug(err);
                return res.status(500).send();
              }
              debug('Token info: ' + info);
              debug('Tokens removed: ' + count);
              return res.send();
            });
      });


  });

};
