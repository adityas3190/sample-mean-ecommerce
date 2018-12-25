var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/ecommerce';

mongoose.connect(dburl);

mongoose.connection.on('connected',function(){
	console.log("Connected on "+dburl);
});

mongoose.connection.on('disconnected',function(){
	console.log("Connected  disconnected");
});

mongoose.connection.on('error',function(err){
	console.log("Following error occured "+err);
});

process.on('SIGINT',function(){
	mongoose.connection.close(function(){
		console.log("Mongoose disconnected");
	});
});

//Bring in Schema and MOdels
require('./account.model');
require('./inventory.model');
require('./order.model');