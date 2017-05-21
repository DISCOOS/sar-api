module.exports = function (app) {

const bearerTokenValidation = require('express-accesstoken-validation');

// Authorization through KOVA
let options = {
  validationUri: 'http://api.kova.no/api/values',
  tokenParam: 'token',
  unprotected: ['/api/SarUsers/login','/api/sarusers/login', '/api/SARUsers/login']
}


// Only use token validation for production
if(process.env.NODE_ENV == 'production') {
    console.log("Production server started, token-validation required")
//app.use(bearerTokenValidation(options));
}


};



