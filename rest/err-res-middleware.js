"use strict";

let SwipesError = require( './swipes-error' );

let res = (req, res, next) => {
	// T_TODO: make a wrong URL request, and this one gets picked up!
  return res.status(200).json({ok: true, result: res.locals.response});
}

let err = (err, req, res, next) => {
  if (err instanceof SwipesError) {
    return res.status(200).json({ok: false, error: err.message});
  }

  return next(err);
}

module.exports = {
  err: err,
  res: res
}
