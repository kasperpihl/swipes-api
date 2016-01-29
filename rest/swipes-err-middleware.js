"use strict";

let SwipesError = require( './swipes-error' );

let err = (err, req, res, next) => {
  if (err instanceof SwipesError) {
    return res.status(200).json({ok: false, error: err.message});
  }

  return next(err);
}

module.exports = err;
