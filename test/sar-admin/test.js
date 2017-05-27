describe('/SAR-Admin test suite', function () {

    describe('', function () {
        let token;
        let verificationToken;
        let demoUserId;
        let redirectLink;
        let userUrl = '/api/SARUsers';


        it('No logged in users should give 401', (done) => {
            api.get('/api/missions')
                .expect(401, done);
        });


        it('Wrong credentials should give 401', (done) => {
            api.post(userUrl + '/login')
                .send({ username: "wrong@example.com", password: "mypassword" })
                .expect(401, done);
        });


        it('Should login as test admin user with token in reponse', (done) => {
            api.post(userUrl + '/login')
                .type('form')
                .send({ username: "demo@kova.no", password: "demo" })
                .expect(200)
                .end((err, res) => {

                    if (err) return done(err);

                    token = res.body.user.access_token;
                    done();
                });
        });

        it('Should be allowed to create a new mission after login, with access-token in header.', (done) => {
            api.post('/api/missions')
                .set( 'Authorization', 'Bearer ' + token )
                .send({
                    "isActive": true,
                    "isEmergency": true,
                    "title": "string",
                    "description": "string",
                    "dateStart": "2017-05-21T20:25:00.657Z",
                    "dateEnd": "2017-05-21T20:25:00.657Z",
                    "meetingPoint": {
                        "lat": 0,
                        "lng": 0
                    },
                    "meetingPointNicename": "string",
                    "creator": 1
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });




    });

})


