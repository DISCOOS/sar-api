describe('Testing user role', function () {

    describe('', function () {
        let token;
        let verificationToken;
        let demoUserId;
        let redirectLink;
        let userUrl = '/api/SARUsers';


        it('No logged in users should give 401 response', (done) => {
            api.get('/api/missions')
                .expect(401, done);
        });


        it('Wrong credentials should give 401 response', (done) => {
            api.post(userUrl + '/login')
                .send({ username: "wrong@example.com", password: "mypassword" })
                .expect(401, done);
        });


        it('Should login as testuser with token in reponse', (done) => {
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

        it('User should not be allowed to POST mission', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });

         it('User should not be allowed to PUT mission', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });

         it('User should not be allowed to DELETE mission', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });

         it('User should not be allowed to DELETE missionresponses', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should not be allowed to DELETE expences', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should not be allowed to DELETE Alarm', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should not be allowed to DELETE Tracking', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should not be allowed to POST alarm', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should have access to missions ', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should have access to missionresponses', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should have access to own expences', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });


         it('User should not have access to others expences', (done) => {
            api.get('/api/missions')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        });



        




    });

})


