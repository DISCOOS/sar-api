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







    // Get kova-persons


    /**
     * 
     * 
     * var results = response.results;
     * foreach ( person : results ) 
     *  id = person.id;
     * 
     * Alle personer i KOVA har en ID.
     * Vi mapper til denne iden med SARUser
     * - Denne id-en vil alltid mappe til riktig person.
     * - For å skaffe brukerinfo utover ID modifiserer vi responsen til Saruser.find() ved å connecte til KOVA
     *   og returnere dette uten at det lagres i vår db
     * - 
     * 
     *  KOVA trenger:
     *  - Person.getPersonByID(id)
     *  - getAllPersons() // id på hver person
     *  
     * 
     * 
     *================ getPersons()
     * Her må vi få tak i liste fra KOVA, men vi trenger å legge på våre egne properties.
     * foreach(person : response.persons) {
     * 
     * id = person.id;
     * 
     * person.isAvailable = Saruser.findById(id).isAvailable;
     * // Hvis findByID returnerer null så betyr det at vedkommende hverken er
     * // isAvailabl eller isTrackable fordi vedkommende ikke har app
     * // isAvailble og isTrackable settes som henholdsvis true og false ved førstegangsinnlogging
     * person.isTrackable = Saruser.findById(id).isTrackable;
     * 
     * 
     * } 
     * 
     * return 
     * 
     *       

    SarUser.login(username, pass) {

    //var sar_response = isUser(id)


    var kova_response = KOVA.token(username, pass)

     if(sar_response == empty) {
      // Dette betyr at vedkommende ikke har logget inn med app
      // Sjekk kovarespons for å se om bruker finnes der
     
            if(kova_response == 401) {
                // Vedkommende finnes ikke i KOVA, send ugyldig credentials respons.
                return;
            }
            
    // Bruker finnes i KOVA, men ikke i sAR-api
    // Lag ny SARUser
    SARUser.create(kovaID, isAvailable = true, isTrackable = false)
     
     }

     // SAR-User eksisterer fra før, det betyr at vi kan hente respons fra KOVA
    // Legg PrimKey fra response til i SARUser
    // Legg token i en cookie


     // Appender kova-personinfo til response
     var kova_results = KOVA.getPersonByID(id)
     var new_results = {};
     
     // Appender alt som ligger i KOVA
     new_results.name = kova_results.name;
     new_results.email = kova_results.email;
     new_results.phone = kova_results.phone;
     new_results.priveleges = kova_results.priveleges;
     .....
     
     
     res.send(new_results);
     }
     * ============== Saruser.login(username, password) {
     * 
     *  // Loginn med kova som vanlig
     *  // Sjekk KOVA om vedkommende har admin-rettigheter
     * }
     * 
     */
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
