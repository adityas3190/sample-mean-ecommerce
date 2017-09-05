var express= require('express');
var router = express.Router();
var ctrlHotels = require("../controllers/hotels.controllers");
var ctrlReviews = require("../controllers/reviews.controllers");
router.route('/hotel')
		.get(ctrlHotels.hotelsGetAll)
    	.post(ctrlHotels.hotelsAddOne);

router.route('/hotel/:hotelId')
		.get(ctrlHotels.hotelsGetOne)
    	.put(ctrlHotels.hotelsUpdateOne)
		.delete(ctrlHotels.hotelsDeleteOne);

//Reviews route
router.route('/hotel/:hotelId/reviews')
    .get(ctrlReviews.reviewsGetAll)
    .post(ctrlReviews.reviewsAddOne);

router.route('/hotel/:hotelId/reviews/:reviewId')
    .get(ctrlReviews.reviewsGetOne)
	.put(ctrlReviews.reviewsUpdateOne)
	.delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;
