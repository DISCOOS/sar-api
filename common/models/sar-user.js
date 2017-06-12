'use strict';

var app = require('../../server/server');

// Need this for async-handling
var async = require('async');


module.exports = function (Saruser) {

    Saruser.disableRemoteMethodByName('create', true);				// Removes (POST) /Sarusers
    //Saruser.disableRemoteMethodByName('upsert', true);				// Removes (PUT) /Sarusers
    Saruser.disableRemoteMethodByName('deleteById', true);			// Removes (DELETE) /Sarusers/:id
    Saruser.disableRemoteMethodByName("updateAll", true);				// Removes (POST) /Sarusers/update
    //Saruser.disableRemoteMethodByName("updateAttributes", false);		// Removes (PUT) /Sarusers/:id
    Saruser.disableRemoteMethodByName('createChangeStream', true);


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



    /*========================================================================================*/

    /**
     * Gets list of persons from KOVA and map som SAR-data to each person if found
     */
    Saruser.persons = function (req, cb) {
        // Get cookie from request
        //let cookieToken = req.cookies.access_token;
        let bearerToken = req.headers.authorization.substr(7);

        // Call KOVA, pass in cookie
        app.models.kova.persons(bearerToken)
            .then((persons) => {
                async.forEach(persons, (p, doneFind) => {
                    if (p.PrimKey) {
                        Saruser.findOne({ where: { kovaId: p.PrimKey } })
                            // Found saruser with this kovaId, so user has app
                            .then((result) => {
                                if (result) {
                                    p.hasApp = true;
                                    p.id = result.id;
                                    p.isAvailable = result.isAvailable;
                                }
                                else {
                                    p.hasApp = false;
                                }
                                doneFind()
                            })
                            .catch((err) => {
                              //  console.log(err)
                              //  console.log("-----primary key: -------- " + p.PrimKey)
                                doneFind()
                            })
                    }

                }, (err) => {
                    // iterating done, return
                    cb(null, persons)
                })
            })
            .catch((err) => {
                cb(err, null)
            })
    }

    /**
     * --------------------------------------------------------------------------
     *  LOGIN FUNCTIONALITY
     * --------------------------------------------------------------------------
     *      1. Make request to KOVA
     *      2. If user exists in KOVA (200 response), then grab primarykey and check if the user exists locally in sar-status database. 
     *           2.1. If user exists locally, means that they have used sar-status before. Send 200 response with user-data + token
     *           2.2. If user does not exist, we have to create a new user with PK from KOVA. Send 200 response with user-data + token afterwards
     */

    Saruser.login = function (username, password, cb) {

        // First make request to kova
        app.models.kova.token(username, password)
            .then((response) => {
                // Check if there is a persisted user with given kovaId
                Saruser.findOne({ where: { kovaId: response.user.personRef } })
                    // found sar-user
                    .then((saruser) => {
                        saruser.access_token = response.access_token;
                        cb(null, saruser)
                    })
                    // couldnt find sar-user (or other error)
                    .catch((err) => {
                        // Make new saruser
                        Saruser.create(
                            {
                                kovaId: response.user.personRef,  // Grab primary-key from response
                                isAvailable: true,
                                isTrackable: false,
                                isAdmin: response.user.privileges & 256 == 256, // Grab priveleges from response
                                name: response.user.name,
                                email: response.user.email,
                                expenceId: 0
                            }).
                            then((saruser) => {
                                // successfully created sar-user
                                saruser.access_token = response.access_token;
                                cb(null, saruser)
                            })
                            .catch((err) => {
                                // error creating sar-user
                                cb(err, null)
                            })
                    })

            })
            .catch((err) => {
                //console.log(err)
                // error with kova login, send 401 response
                return cb({ statusCode: 401, message: "Wrong username / password" }, null);
            })
    };


    /***
     * After successfull login to KOVA, 
     * we need to grab access_token and store in a cookie for later requests 
     */
    Saruser.afterRemote('login', function setLoginCookie(context, remoteMethodOutput, next) {
        var res = context.res;
        var req = context.req;

        // Check first to see if kova-login is a success
        if (!remoteMethodOutput || !remoteMethodOutput.user || !remoteMethodOutput.user.access_token)
            return next();

        // Add cookie to response
        res.cookie(
            'access_token',
            remoteMethodOutput.user.access_token, {
                signed: false, // Bug: Signed cookies wont work?
                // signed: req.signedCookies ? true : false, // Can detect if client has modified cookie   
                //maxAge: 10000 * remoteMethodOutput.user.expires_in,
                maxAge: 10000 * 3600,
                httpOnly: true, // Cookie cant be read by client-side javascript
                //secure: false  // Cookie cant be read by non-ssl connection
            });



        //delete remoteMethodOutput.user.access_token;

        return next();
    });
}