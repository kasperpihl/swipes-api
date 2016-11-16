"use strict";

import SwipesError from './swipes-error';

const swipesErrorMiddleware = (err, req, res, next) => {
  if (err instanceof SwipesError) {
    return res.status(200).json({
      ok: false,
      error: err.message
    });
  }

  return next(err);
}

export {
  swipesErrorMiddleware,
  SwipesError
};
