var app;
var supertest;

// Uncomment if you want to include common exports.options or similar
//var common = require("./common");


function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
};


describe("SAR Status API Testsuite", function () {
    before(function () {
        //console.log("running something before each test");
        app  = require('../server/server');
        supertest = require('supertest');
        global.api = supertest(app);
    });

    beforeEach(function () {
       //console.log("running something before each test");
    });

    importTest("", './sar-status-admin/test');
    importTest("", './sar-status-personnel/test');

    after(function () {
        console.log("Finished testing.");
    });
})
