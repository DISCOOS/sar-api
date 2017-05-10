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



    // Catch all requests
    // If no cookie is set, then access is unauthorized
    /*
    app.all('/api/*', function(req, res, next) {
        if (req.url === '/api/kova/login')
            return next();


        var tokenCookie = "Bearer " + req.cookies.access_token;
        var tokenHeader = req.headers.authorization;

        if (tokenCookie == tokenHeader) {
            return next();
        }
 
        res.status(401).send("Error: Unauthorized")
        return;
    });
*/




    // Logging in with KOVA
    app.post('/api/sarusers/login_____', function (req, res, next) {
        console.log("----------SARUSER LOGGING IN--------------")
        var username = req.body.username;
        var password = req.body.password;

        var processResponse = (err, response) => {
            if (err) {
                next(err)
                //res.send(err)
                return;
            }

            // No error, make cookie.
            // Problemer med signed
            res.cookie(
                'access_token',
                response.access_token, {
                    maxAge: 10 * 365 * 24 * 60 * 60,
                    signed: false, // Can detect if client has modified cookie   
                    httpOnly: false, // Cookie cant be read by client-side javascript
                    secure: false // Cookie cant be read by non-ssl connection
                }
            );

            // Dont need token in response, only send user info
            //res.send(response.user)

            //res.send(response)
            next();



        }
        app.datasources.kova.token(username, password, processResponse);
    });



    /**
    Test token
    */
    app.get('/token', function (req, res) {
        console.log('Cookies: ', req.cookies)
        res.send('token');
    });





    // Append token to all KOVA-requests
    app.get("/api/kova*", function (req, res, next) {
        if (req.url === '/api/kova/login')
            return next();

        var cookie = req.cookies.access_token;
        var connector = app.datasources.kova.connector;
        console.log("--------COOKIE----------")
        console.log(cookie)
        if (!cookie) {
            console.log("Error: Ingen token")
            res.status(401).send("Error: Not authorized")
            return;
        }

        // Hook into connector and append authorization-header
        connector.observe('before execute', function (ctx, next) {
            if (cookie) {
                ctx.req.headers.Authorization = "Bearer " + cookie;
            }

            next();
        });

        next();
    });


    app.get('/api/kova/persons', function (req, res) {
            var processResponse = (err, response) => {
                if (err) {
                    res.send(err);
                    return;
                }



                res.send(response);
            }
            app.datasources.kova.persons(processResponse);
        });





}; // module
