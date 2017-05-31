module.exports = function (app) {



    var bodyParser = require('body-parser')
    var cookieParser = require('cookie-parser')

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())
    app.use(cookieParser())


    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(function (req, res, next) {
        res.removeHeader("X-Powered-By");
        next();
    });


app.get('/api/missions', function (req, res, next) {
  console.log("----------get missions---------------")
  console.log(req)
  next();
})





}; // module
