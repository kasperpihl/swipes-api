"use strict";

const COMMON = '../../common/';

let express = require( 'express' );
let router = express.Router();


router.post("/tasks.create", (req, res) => {
	console.log('Im here');

	res.status(200).json({});
});

module.exports = router;
