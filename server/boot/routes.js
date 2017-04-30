module.exports = function(app) {

    var bodyParser = require('body-parser')
    var cookieParser = require('cookie-parser')

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())
    app.use(cookieParser())



    // Catch all requests
    // If no cookie is set, then access is unauthorized
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





    // Logging in with KOVA
    app.post('/api/kova/login', function(req, res) {

        var username = req.body.username;
        var password = req.body.password;

        var processResponse = (err, response) => {
            if (err) {
                res.send(err)
                return;
            }

            // No error, make cookie.
            // Problemer med signed
            res.cookie(
                'access_token',
                response.access_token, {
                    maxAge: 10 * 365 * 24 * 60 * 60,
                    //  signed: true, // Can detect if client has modified cookie   
                    httpOnly: true, // Cookie cant be read by client-side javascript
                    //  secure: true // Cookie cant be read by non-ssl connection
                }
            );

            // Dont need token in response, only send user info
            //res.send(response.user)
            res.send(response)

        }
        app.datasources.kova.token(username, password, processResponse);
    });



    /**
    Test token
    */
    app.get('/token', function(req, res) {
        console.log('Cookies: ', req.cookies)
        res.send('token');
    });





    // Append token to all KOVA-requests
    app.get("/api/kova*", function(req, res, next) {

        var cookie = req.cookies.access_token;
        var connector = app.datasources.kova.connector;

        if (!cookie) {
            console.log("Error: Ingen token")
                //res.status(401).send("Error: Not authorized")
                //return;
        }

        // Hook into connector and append authorization-header
        connector.observe('before execute', function(ctx, next) {
            if (cookie) {
                ctx.req.headers.Authorization = "Bearer " + cookie;
            }

            next();
        });

        next();
    });



/**
 * =================================
 * 
 * WORKAROUNDDDD
 * 
 * 
 * =================================
 */

     // Append token to all SAR-users which is connected to KOVA
    app.get("/api/sarusers", function(req, res, next) {

        var cookie = req.cookies.access_token;
        var connector = app.datasources.kova.connector;

        if (!cookie) {
            console.log("Error: Ingen token")
                //res.status(401).send("Error: Not authorized")
                //return;
        }

        // Hook into connector and append authorization-header
        connector.observe('before execute', function(ctx, next) {
            if (cookie) {
                ctx.req.headers.Authorization = "Bearer " + cookie;
            }

            next();
        });

        next();
    });



    // Get kova-persons
    app.get('/api/kova/persons', function(req, res) {
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
