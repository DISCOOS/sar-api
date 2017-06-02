'use strict';

var async = require('async');
var app = require('../../server/server');

module.exports = function (Expence) {


 
    
    Expence.afterRemote('find', function (ctx, remoteMethodOutput, next) {  
        if (!ctx.result) { next(); }
            if (Array.isArray(ctx.result)) {
                ctx.result.forEach(function (result) {
                    if (result.sarUserId) {
                        
                        app.models.SARUser.findById(result.sarUserId)
                            .then(saruser => {
                                result.sarUser = saruser;
                                // her må du ha doneFind og async foreach
                                next();
                            })
                    }

                });
            } else {
                if (ctx.result.sarUserId) {
                    app.models.SARUser.findById(ctx.result.sarUserId)
                        .then(saruser => {
                            ctx.result.sarUser = saruser;
                            next();
                        })
                }
            }
    });

}
