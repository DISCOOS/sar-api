/*
module.exports = function (app) {
      for (let i = 0; i < 2; i++) {

    console.log("Crating mission")


    app.models.Mission.create(
        {
            "isActive": true,
            "isEmergency": true,
            "title": "Tittel",
            "description": "Ttitelsfd sdf sdf",
            "meetingPoint": {
                "lat": 12,
                "lng": 14
            },
            "meetingPointNicename": "BERGE",
            "creator": 1
        }).
        then((response) => {
            console.log("OK!")
            console.log(response)
        })
        .catch((err) => {
            console.log("Error:")   
            console.log(err)
        })


    }
}
*/