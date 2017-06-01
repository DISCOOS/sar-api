'use strict';

var async = require('async');
var app = require('../../server/server');

module.exports = function (Alarmuser) {


    /**
     * Append saruser to alarmuser response
     */
    
    Alarmuser.afterRemote('find', function (ctx, remoteMethodOutput, next) {
        
        console.log(ctx.result)
        if (ctx.result) {
            if (Array.isArray(ctx.result)) {
                ctx.result.forEach(function (result) {
                    if (result.sarUserId) {
                        
                        app.models.SARUser.findById(result.sarUserId)
                            .then(saruser => {
                                result.sarUser = saruser;
                            })
                    }

                });
            } else {
                if (ctx.result.sarUserId) {
                    app.models.SARUser.findById(ctx.esult.sarUserId)
                        .then(saruser => {
                            ctx.result.sarUser = saruser;
                        })
                }
            }
        }
        next();

    });

}
