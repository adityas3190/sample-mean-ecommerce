var MongoClient = require('mongodb').MongoClient();

var dburl = 'mongodb://localhost:27017/hotel-data';
var _connection = null;

var open = function(){
	MongoClient.connect(dburl,function(err,db){
		if(err)
		{
			console.log("Error in connecting to database ",err);
			return ;
		}
		_connection = db;
		console.log("DB connection now open ",db);

	});
};

var get = function(){
	return _connection;
};

module.exports = {
	open:open,
	get:get
};