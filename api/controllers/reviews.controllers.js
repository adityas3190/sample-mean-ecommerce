var mongoose = require("mongoose");
var Hotel = mongoose.model("Hotel");
module.exports.reviewsGetAll = function (req,res) {
    var thisHotel = req.params.hotelId;
    Hotel.findById(thisHotel)
        .select('reviews')
        .exec(function(err,docs){
            console.log("Searching for hotel ",thisHotel);
            var response = {
                status:200,
                message:[]
            };
            if(err)
            {
                console.log("Error occured "+err);
                response.status = 500;
                response.message = err;
            }
            else if(!docs)
            {
                console.log("Hotel not found ");
                response.status = 404;
                response.message = {"message":"Hotel not found"};
            }
            else
                response.message = docs.reviews;
            res.status(response.status)
                .json(response.message);
        });
};
module.exports.reviewsGetOne = function (req,res) {
    var thisHotel = req.params.hotelId;
    var thisReview = req.params.reviewId;
    Hotel.findById(thisHotel)
        .select('reviews')
        .exec(function(err,hotel){
            var review = hotel.reviews.id(thisReview);
            res.status(200)
                .json(review);
        });

};
module.exports.reviewsAddOne = function (req,res) {
    var thisHotel = req.params.hotelId;
    Hotel.findById(thisHotel)
        .select('reviews')
        .exec(function(err,docs){
            console.log("Searching for hotel ",thisHotel);
            var response = {
                status:200,
                message:[]
            };
            if(err)
            {
                console.log("Error occured "+err);
                response.status = 500;
                response.message = err;
            }
            else if(!docs)
            {
                console.log("Hotel not found ");
                response.status = 404;
                response.message = {"message":"Hotel not found"};
            }
            if(docs)
            {
                _addReview(req,res,docs);
            }
            else
            {
                res.status(response.status)
                    .json(response.message);
            }

        });


};
var _addReview = function (req,res,hotel) {
    hotel.reviews.push({
        name : req.body.name,
        rating : parseInt(req.body.rating,10),
        review : req.body.review

    });
    hotel.save(function (err,hotelUpdated) {
        if(err)
        {
            console.log("Error has occured "+err);
            res.status(500).json(err);
        }
        else
        {
            res.status(201).json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
        }
    });

};
module.exports.reviewsUpdateOne = function (req,res) {
    var thisHotel = req.params.hotelId;
    var thisReview = req.params.reviewId;
    Hotel.findById(thisHotel)
        .select('reviews')
        .exec(function(err,hotel){
            response = {
                status : 200,
                message:hotel
            };
            if(err)
            {
                response.status = 500;
                response.message = err;
            }
            else if(!hotel)
            {
                response.status = 404;
                response.message = "Hotel not found"
            }
            var review = hotel.reviews.id(thisReview);
            if(!review)
            {
                response.status = 404;
                response.message = "Review not found";
            }
            else
            {
                _updateReview(req,res,hotel,review);
                return ;
            }
            res.status(response.status)
                .json(response.message);
        });
};
var _updateReview  = function (req,res,hotel,review) {
    review.name = req.body.name;
    review.rating = parseInt(req.body.rating,10);
    review.review = req.body.review;
    hotel.save(function (err,review) {
       if(err)
       {
           res.status(500).json(err);
       }
       else
            res.status(204).json();
    });
};
var _deleteReview  = function (req,res,hotel,thisReview) {
    hotel.reviews.id(thisReview).remove();
    hotel.save(function (err,review) {
        if(err)
        {
            res.status(500).json(err);
        }
        else
            res.status(204).json();
    });
};
module.exports.reviewsDeleteOne = function (req,res) {
    var thisHotel = req.params.hotelId;
    var thisReview = req.params.reviewId;
    Hotel.findById(thisHotel)
        .select('reviews')
        .exec(function(err,hotel){
            response = {
                status : 200,
                message:hotel
            };
            if(err)
            {
                response.status = 500;
                response.message = err;
            }
            else if(!hotel)
            {
                response.status = 404;
                response.message = "Hotel not found"
            }
            var review = hotel.reviews.id(thisReview);
            if(!review)
            {
                response.status = 404;
                response.message = "Review not found";
            }
            else
            {
                _deleteReview(req,res,hotel,thisReview);
                return ;
            }
            res.status(response.status)
                .json(response.message);
        });
};