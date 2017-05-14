var app = require('../server');

var dataSource = app.dataSources.mysql;

/*

Automigrate all models

*/

dataSource.automigrate('Alarm', function(err) {
	if(err) throw err;
	dataSource.disconnect();
});


dataSource.automigrate('MissionResponse', function(err) {
	if(err) throw err;
	dataSource.disconnect();
});

dataSource.automigrate('Expence', function(err) {
	if(err) throw err;
	dataSource.disconnect();
});

dataSource.automigrate('Mission', function(err) {
	if(err) throw err;
	dataSource.disconnect();
});

dataSource.automigrate('SARUser', function(err) {
	if(err) throw err;
	dataSource.disconnect();
});

dataSource.automigrate('Tracking', function(err) {
	if(err) throw err;
	dataSource.disconnect();
});

dataSource.automigrate('AlarmUser', function(err) {
	if(err) throw err;
	dataSource.disconnect();
});