var express= require('express');
var router = express.Router();
var controller = require('../controllers/index.ctrl');
router.route('/prefill')
	   .get(controller.prefillData);
router.route('/order')
	   .post(controller.order);

module.exports = router;
