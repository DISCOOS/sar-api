'use strict';

var async = require('async');

module.exports = function (Alarmuser) {


    /**
     * Append saruser to alarmuser response
     */
    Alarmuser.afterRemote('find', function (context, remoteMethodOutput, next) {
        if (ctx.result) {
            if (Array.isArray(ctx.result)) {
                ctx.result.forEach(function (result) {
                    if (result.sarUserId) {
                        app.models.Saruser.findById(result.sarUserId)
                            .then(saruser => {
                                result.sarUser = saruser;
                                delete result.sarUserId;
                            })
                    }

                });
            } else {
                if (ctx.result.sarUserId) {
                    app.models.Saruser.findById(ctx.esult.sarUserId)
                        .then(saruser => {
                            ctx.result.sarUser = saruser;
                            delete ctx.result.sarUserId;
                        })
                }
            }
        }
        next();

    });

}
