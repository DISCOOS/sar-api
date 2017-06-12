'use strict';

var async = require('async');
var app = require('../../server/server');

module.exports = function (Expence) {


    Expence.afterRemote('find', function (ctx, remoteMethodOutput, next) {
        if (!ctx.result) { next(); }

        var newResult = [];
        async.forEach(ctx.result, (result, doneFind) => {
            if (result.sARUserId) {
                app.models.SARUser.findById(result.sARUserId)
                    .then(saruser => {
                        result.sarUser = saruser;
                        newResult.push(result);
                        doneFind()
                    })
                    .catch((err) => {
                        doneFind()
                    })
            }

        }, (err) => {
            // Done iterating
            ctx.result = newResult;
            next();
        })
    });




}
