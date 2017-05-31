module.exports = function (app) {

    const bearerTokenValidation = require('../bin/express-accesstoken-validation');

    // Helmet isa collection of nine smaller middleware functions that set security-related HTTP headers:
    var helmet = require('helmet');

    // Authorization through KOVA
    let options = {
        validationUri: 'http://api.kova.no/api/values',
        tokenParam: 'token',
        unprotected: ['/api/SarUsers/login', '/api/sarusers/login', '/api/SARUsers/login']
    }


    // Only use token validation for production
    //if (process.env.NODE_ENV == 'production')
      //  app.use(bearerTokenValidation(options));
        app.use(helmet());




};



