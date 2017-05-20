module.exports = function (app) {

if(process.env.MY_CUSTOM_VAR) {
    console.log(process.env.MY_CUSTOM_VAR)
} else {
    console.log("not set")
}
const bearerTokenValidation = require('express-accesstoken-validation');


// Authorization through KOVA
let options = {
  validationUri: 'http://api.kova.no/api/values',
  tokenParam: 'token',
  unprotected: ['/api/SarUsers/login','/api/sarusers/login', '/api/SARUsers/login']
}

app.use(bearerTokenValidation(options));

};



