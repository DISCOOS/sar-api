'use strict';

var async = require('async');
var app = require('../../server/server');

module.exports = function (Expence) {


 
    
    Expence.afterRemote('find', function (ctx, remoteMethodOutput, next) {  
        if (!ctx.result) { next(); }
                ctx.result.forEach(function (result) {
                    if (result.sARUserId) {
                        app.models.SARUser.findById(result.sARUserId)
                            .then(saruser => {
                                result.sarUser = saruser;
                                // her må du ha doneFind og async foreach
                                next();
                            })
                    } else {
                        next();
                    }

                });
           
    });

}
