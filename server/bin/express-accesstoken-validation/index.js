'use strict';
const _ = require('lodash');
const request = require('request');
const urlJoin = require('url-join');


function authorization(options) {
  if (!options) {
    throw new Error('Options are missing.')
  }

  if (!options.validationUri) {
    throw new Error('validationUri option is missing.')
  }

  if (!options.tokenParam) {
    throw new Error('tokenParam option is missing.')
  }
  return function (req, res, next) {

    if (_.some(options.unprotected, (route) => {
        return route === req._parsedUrl.pathname
      })) {
      return next();
    }
    
    if (req.headers.authorization) {
      let bearerToken = req.headers.authorization.substr(7);
      
      
  let tokenParam = '';
      var uri = urlJoin(options.validationUri, tokenParam);
      let opts = {
        url: options.validationUri,
        headers: {
          'Authorization' : req.headers.authorization
        }
      }
    
      request(opts, function (err, validationResponse) {
        if (err) {
          console.log(err)
          return res.status(500).send();
        }
        if (validationResponse.statusCode === 200) {
          return next();
        }
        return res.status(401).send()
      });
    } else {
      return res.status(401).send();
    }
  }
}

module.exports = authorization;