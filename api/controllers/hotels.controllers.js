var mongoose = require("mongoose");
var Hotel = mongoose.model("Hotel");
var runGeoQuery = function (req,res) {
	var lat = parseFloat(req.query.lat);
	var lng = parseFloat(req.query.lng);
	var point = {
		type : "Point",
		coordinates :[lng,lat]
	};
	var geoOptions = {
		spherical:true,
		maxDistance :2000,
		num:5
	};
	Hotel
		.geoNear(point,geoOptions,function (err,data,stats) {
			console.log("Statistics "+stats);
			res.status(200).json(data);
        });
};
module.exports.hotelsGetAll = function(req,res)
{
	var offset = 0;
	var count = 5;
	if(req.query && req.query.lng && req.query.lat)
	{
		runGeoQuery(req,res);
		return '';
	}
	if(req.query && req.query.offset)
	{
		offset = parseInt(req.query.offset,10);
	}
	if(req.query && req.query.count)
	{
		count = parseInt(req.query.count,10);
	}
	Hotel.find()
		.skip(offset)
		.limit(count)
		.exec(function (err,hotels) {
			console.log("No of hotels "+hotels.length);
			res.status(200).json(hotels);
        });


};
module.exports.hotelsGetOne = function(req,res)
{
	var thisHotel = req.params.hotelId;
	Hotel.findById(thisHotel)
				.exec(function(err,docs){
					console.log("Searching for hotel ",thisHotel);
					res.status(200)
						.json(docs);
	});

};
var _splitArray = function (arr) {
    console.log(arr.length);
	if(arr && arr.length >0)
	{
        console.log(arr);
		return arr.split(",");

	}
	return [];

};
module.exports.hotelsAddOne = function(req,res)
{
	Hotel
		.create({
			name:req.body.name,
			description:req.body.description,
			stars:parseInt(req.body.stars,10),
			services:_splitArray(req.body.services),
			photos:_splitArray(req.body.photos),
			currency:req.body.currency,
			location:{
				address:req.body.address,
				coordinates:[parseFloat(req.body.lng),parseFloat(req.body.lat)]
			}
		},function (err,hotel) {
			if(err)
			{
				console.log("Error creating hotel"+err);
				res.status(400).json({"msg":"Bad request","info":err});
			}
			else
			{
				console.log("New hotel created");
				res.status(201).json(hotel);
			}

        });
};
module.exports.hotelsUpdateOne = function (req,res) {
    var thisHotel = req.params.hotelId;
    Hotel.findById(thisHotel)
		.select("-reviews -rooms")
        .exec(function(err,docs){
            console.log("Searching for hotel ",thisHotel);
            var response  = {
            	status : 200,
				message : docs
			};
            if(err)
			{
				response.status = 500;
				response.message = err;
			}
			else if(!docs)
			{
				response.status = 404;
				response.message = "Specifies hotel id not found";
			}
			if(response.status != 200)
			{
                res
					.status(response.status)
                    .json(response.message);
			}
			else
			{
                docs.name = req.body.name;
                docs.description = req.body.description;
                docs.stars = parseInt(req.body.stars,10);
                docs.services =_splitArray(req.body.services);
                docs.photos =_splitArray(req.body.photos);
                docs.currency = req.body.currency;
                docs.location = {
                	address:req.body.address,
                    coordinates:[parseFloat(req.body.lng),parseFloat(req.body.lat)]
            	};
                docs.save(function (err,hotelUpdated) {
						if(err)
						{
							res.status(500).json(err);
						}
						else
						{
							res.status(204).json();
						}
                });
			}

        });
};
module.exports.hotelsDeleteOne = function (req,res) {
	var hotelId = req.params.hotelId;
	Hotel
		.findByIdAndRemove(hotelId)
		.exec(function (err,hotel) {
			if(err)
			{
				res
					.status(500)
					.json(err);
			}
			else
			{
				res
					.status(204)
					.json();
			}
        });
};