require('./api/data/db');
var express = require('express');
var path = require("path");
var app = express();
var routes = require('./api/routes');
var bodyData = require("body-parser");
app.set('port',3000);

app.use(function(req,resp,next){
	console.log(req.method,req.url);
	next();
});
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyData.json());
app.use(bodyData.urlencoded({extended:true}));
app.use('/api',routes);


var server = app.listen(app.get('port'),function(){
	var port = server.address().port;
	console.log('Magic happens on '+port)
});