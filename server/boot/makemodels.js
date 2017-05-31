/**
 * 
 * Make some example models to fill up the database with some data
 */


module.exports = function (app) {


    var Mission = app.models.Mission;
    const mission1 = {
        "isActive": true,
        "isEmergency": true,
        "title": "En aksjon",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        "dateStart": "2017-05-31T21:01:31.696Z",
        "dateEnd": null,
        "meetingPoint": {
            "lat": "60.3891768",
            "lng": "5.330574"
        },
        "meetingPointNicename": "Bergen Busstasjon",
        "creator": 1
    }

    const mission2 = {
        "isActive": true,
        "isEmergency": true,
        "title": "En annen aksjon",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        "dateStart": "2017-05-31T21:01:31.696Z",
        "dateEnd": null,
        "meetingPoint": {
            "lat": "60.390393",
            "lng": "5.327233"
        },
        "meetingPointNicename": "Lille Lungegårdsvannet, Bergen",
        "creator": 1
    }
    Mission.create([
        mission1,
        mission2
    ], function (err, missions) {
        if (err) {
            console.log(err)
            throw err;
        }


        console.log('---Created missions----:', missions);

        // create an alarm for this mission
        missions[0].alarms.create({
            "date": "2017-05-31T21:01:31.723Z",
            "message": "En varsling"
        }, function (err, alarm) {
            if (err) {
                console.log(err)
                throw err;
            }
            console.log('----Created alarm1----', alarm);
        });

        // create an alarm for this mission
        missions[1].alarms.create({
            "date": "2017-05-31T21:01:31.723Z",
            "message": "En annen varsling"
        }, function (err, alarm) {
            if (err) {
                console.log(err)
                throw err;
            }
            console.log('----Created alarm2----', alarm);
        });
    });
};