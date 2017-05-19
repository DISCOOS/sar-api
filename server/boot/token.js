module.exports = function (app) {


const bearerTokenValidation = require('express-accesstoken-validation');


// Authorization through KOVA
let options = {
  validationUri: 'http://api.kova.no/api/values',
  tokenParam: 'token',
  unprotected: ['/api/SarUsers/login','/api/sarusers/login']
}

app.use(bearerTokenValidation(options));

};



