// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-component-passport
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

// Enable internationalization and localization
const SG = require('strong-globalize');
const g = SG();

/*
 * Internal utilities for models
 */

let crypto = require('crypto');
let assert = require('assert');

/**
 * Generate a key
 * @param {String} hmacKey The hmac key, default to 'loopback'
 * @option {String} algorithm The algorithm, default to 'sha1'
 * @option {String} encoding The string encoding, default to 'hex'
 * @returns {String} The generated key
 */
function generateKey(hmacKey, algorithm, encoding) {
  assert(hmacKey, g.f('{{HMAC}} key is required'));
  algorithm = algorithm || 'sha1';
  encoding = encoding || 'hex';
  let hmac = crypto.createHmac(algorithm, hmacKey);
  let buf = crypto.randomBytes(32);
  hmac.update(buf);
  return hmac.digest(encoding);
}

exports.generateKey = generateKey;
