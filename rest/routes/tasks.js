var COMMON = '../../common/';
var express = require( 'express' );
var router = express.Router();


router.post("/tasks.create", function (req, res) {
	console.log('Im here');

	res.status(200).json({});
});

module.exports = router;
