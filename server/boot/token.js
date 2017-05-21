module.exports = function (app) {


var morgan  = require('morgan')

//This tells express to log via morgan
//and morgan to log in the "combined" pre-defined format
app.use(morgan('combined'))
console.log("------test123-------")

const bearerTokenValidation = require('express-accesstoken-validation');

// Authorization through KOVA
let options = {
  validationUri: 'http://api.kova.no/api/values',
  tokenParam: 'token',
  unprotected: ['/api/SarUsers/login','/api/sarusers/login', '/api/SARUsers/login']
}


// Only use token validation for production
if(process.env.NODE_ENV == 'production')
app.use(bearerTokenValidation(options));

};



