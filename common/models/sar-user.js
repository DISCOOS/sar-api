'use strict';

var app = require('../../server/server');



module.exports = function (Saruser) {



    /*========================================================================================/
        DEFINE REMOTE METHODS
    =========================================================================================*/
    Saruser.remoteMethod(
        'login',
        {
            accepts: [
                { arg: 'username', type: 'string', required: true },
                { arg: 'password', type: 'string', required: true },
            ],
            http: { path: '/login', verb: 'post' },
            returns: { arg: 'user', type: 'Object' }
        });


    Saruser.remoteMethod(
        'persons',
        {
            accepts: [
                { arg: 'req', type: 'object', http: { source: 'req' } }
            ],
            http: { path: '/persons', verb: 'get' },
            returns: { arg: 'persons', type: 'Object' }
        });

    Saruser.remoteMethod(
        'getPersonByPK',
        {
            accepts: [
                { arg: 'req', type: 'object', http: { source: 'req' } },
                { arg: 'pk', type: 'string', required: true }
            ],
            http: { path: '/getPersonByPK', verb: 'get' },
            returns: { arg: 'person', type: 'Object' }
        });



    /*========================================================================================*/




    Saruser.persons = function (req, cb) {
        // Get cookie from request...
        var cookieToken = req.cookies.access_token;

        var kovaModel = app.models.kova;
        let processResponse = (err, response) => {

            // Check if each person has app or not
            if(!response) return;

            var persons = response;
            persons.forEach(
                (p) => {
                    let primKey = p.PrimKey;
                    p.hasApp = false;

                    // Check local saruser to see if exists
                    Saruser.findOne({ where: { kovaId: primKey } })
                        .then(function (result) {
                            p.hasApp = (result) ? true : false;
                        })
                }
            )


            setTimeout(function () {
                cb(null, persons)
            }, 1000);

        }
        // Call KOVA, pass in cookie
        kovaModel.persons(cookieToken, processResponse);
    }



    /**
     * --------------------------------------------------------------------------
     *  When logging in:
     * --------------------------------------------------------------------------
     *      1. Make request to KOVA
     *      2. If user exists in KOVA (200 response), then grab primarykey and check if the user exists locally in sar-status database. 
     *           2.1. If user exists locally, means that they have used sar-status before. Send 200 response with user-data + token
     *           2.2. If user does not exist, we have to create a new user with PK from KOVA. Send 200 response with user-data + token afterwards
     * 
     * 
     */
    Saruser.login = function (username, password, cb) {

        // Gives access to KOVA-API
        var kovaModel = app.models.kova;

        var pk;
        var isAdmin = false;

        let processResponse = (err, response) => {

            if (err) {
                // Uh-oh; Kova response generated an error. This probably means that the user dont exist
                // TODO : Check error status code for 401 to be sure that response is unauthorised. Catch error otherwise
                cb(null, err)

                // KOVA-response did not generate error, we are OK
            } else {

                // Grab primary-key from response
                pk = response.user.personRef;

                // Set priveleges
                isAdmin = response.user.privileges & 256 == 256;
                

                console.log("----- kova response = 200 -------")
                console.log("isAdmin: " + isAdmin)
                console.log("---------PRIMARY KEY-------")
                console.log(pk)

                // So we need to check if user exists locally
                Saruser.findOne({ where: { kovaId: pk } }, function (err, user) {
                    console.log("-----finding Sar-user.....-----")
                    console.log("Err: " + err);
                    console.log("User: " + user)

                    // Doesnt exist, make a new instance
                    if (!user) {
                        console.log("----- user dont exsist, created user----")
                        Saruser.create({ kovaId: pk, isAvailable: true, isTrackable: false, isAdmin: isAdmin })
                        // User exist
                    } else {
                        console.log("--- user exsists----")
                    }


                });

                cb(null, response)

            }

            return;

        }

        // Do request to KOVA
        kovaModel.token(username, password, processResponse);
        //cb(null, "")

    };


    /***
     * After successfull login to KOVA, we need to grab access_token and store in a cookie for later requests 
     */
    Saruser.afterRemote('login', function setLoginCookie(context, remoteMethodOutput, next) {
        console.log("\n\n------------afterRemote login-------------\n\n")
        var res = context.res;
        var req = context.req;
        console.log(remoteMethodOutput.user.access_token)

        if (remoteMethodOutput != null) {
            if (remoteMethodOutput.user.user.personRef != null) {
                res.cookie(
                    'access_token',
                    remoteMethodOutput.user.access_token, {
                        signed: false, // VIRKER BARE MED FALSE?
                        // signed: req.signedCookies ? true : false, // Can detect if client has modified cookie   
                        maxAge: 10000 * remoteMethodOutput.user.expires_in,
                        httpOnly: true, // Cookie cant be read by client-side javascript
                        //secure: false  // Cookie cant be read by non-ssl connection
                    });
                //   return res.redirect('/');
            }
        }

        return next();
    });



}