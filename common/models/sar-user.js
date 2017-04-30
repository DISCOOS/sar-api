'use strict';

module.exports = function (Saruser) {

    Saruser.find = function (filter, cb) {
        // invoke the default method
        find.call(Saruser, function (err, original_results) {
            console.log("FAEN")

            var results = {};     // a placeholder for your expected results

            results.name = original_results.name;
            results.email = original_results.email;


            cb(null, results)
        });
    }


    Saruser.afterRemote('find', function (ctx, user, next) {
        if (ctx.result) {
            var results = {};
            
            results.name = ctx.result.Name;
            results.email = ctx.result.Email;
        }

        next();
    });
}
