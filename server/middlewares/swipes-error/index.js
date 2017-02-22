import SwipesError from './swipes-error';

const swipesErrorMiddleware = (err, req, res, next) => {
  if (typeof err === 'object' && err.name === 'SwipesError') {
    return res.status(200).json({
      ok: false,
      error: err.message,
      extra: err.extra,
    });
  }

  return next(err);
};

export {
  swipesErrorMiddleware,
  SwipesError,
};
